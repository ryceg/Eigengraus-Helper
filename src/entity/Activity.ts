import {Column, Entity, getConnection, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class Activity {
    constructor(member: string, points: number) {
        this.member = member;
        this.points = points;
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column("timestamp", {
        default: () => "CURRENT_TIMESTAMP"
    })
    ts: Date;

    @Column()
    member: string;

    @Column({nullable: true})
    channel: string;

    @Column({default: 0})
    points: number;


    public async createActivity() {
        await getConnection().getRepository(Activity).createQueryBuilder("activity").insert().into(Activity).values([this]).execute()
    }

    static async getTopMembers(): Promise<TopMemberResult[]> {
        const rawData = await getConnection().manager.query("select \"member\", count(*), (select sum(points) from public.activity where activity.ts > (current_date - interval '30' day) ) as \"points\" from (select * from public.activity where activity.ts > (current_date - interval '30' day) ) as \"foo\" group by \"member\" order by count desc limit 5;  ")
        console.log("Raw data: ",rawData);
        const activities: TopMemberResult[] = [];
        rawData.forEach((data) => {
           activities.push(new TopMemberResult(data.member, data.points, data.count));
        });
        return activities;
    }

    static async getTopChannels(): Promise<TopChannelResult[]> {
        const rawData = await getConnection().manager.query("select channel, count(*) from activity group by channel;");
        const activities: TopChannelResult[] = [];
        rawData.forEach((data) => {
            activities.push(new TopChannelResult(data.channel, data.count));
        });
        return activities;
    }

    static async getPointsForMemberLast30Days(member: string): Promise<number> {
        const rawData = await getConnection().manager.query("select sum(points) from activity where \"member\" = '" + member + "'");
        return rawData[0].sum;
    }

    static async getMemberContributions(member: string): Promise<MemberResult> {
        const memberResult = new MemberResult();
        const topChannelContributionsRaw = await getConnection().manager.query("select channel, sum(points) from activity where \"member\" = '" + member + "' group by channel order by sum desc limit 10;");
        const totPointsRaw = await getConnection().manager.query("select sum(points) from activity where \"member\" = '" + member + "'");
        const totPoints7Days = await getConnection().manager.query("select sum(points) from activity where \"member\" = '" + member +"' and ts > (current_date - interval '7' day) ;")
        console.log(topChannelContributionsRaw.length, totPointsRaw.length, totPoints7Days.length);
        if (topChannelContributionsRaw.length === 0 || totPointsRaw.length === 0 || totPoints7Days.length === 0) {
            console.log("Returning");
            return null;
        }

        memberResult.member = member;
        memberResult.points7Days = totPoints7Days[0].sum;
        memberResult.totPoints = totPointsRaw[0].sum;
        var map = new Map<string, number>();

        for (let contr in topChannelContributionsRaw) {
            // @ts-ignore
            map.set(topChannelContributionsRaw[contr].channel, topChannelContributionsRaw[contr].sum);
        }
        memberResult.top10Channels = map;
        return memberResult;
    }
}

export class TopChannelResult {
    channel: string;
    points: number;

    constructor(channel: string, points: number) {
        this.channel = channel;
        this.points = points;
    }
}

export class TopMemberResult {
    member: string;
    points: number;
    count: number;

    constructor(member: string, points: number, count: number) {
        this.member = member;
        this.points = points;
        this.count = count;
    }
}

export class MemberResult {
    member: string;
    top10Channels: Map<string, number>;
    points7Days: number;
    totPoints: number;
}