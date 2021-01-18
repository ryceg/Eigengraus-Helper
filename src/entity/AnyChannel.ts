import {Column, Entity, getConnection, PrimaryColumn} from "typeorm";

@Entity()
export class AnyChannel {
    @PrimaryColumn({name: "channel_id"})
    channelId: string;

    @Column({name: "points_rate"})
    pointsRate: number;

    public static async getAnyChannel(id: string): Promise<AnyChannel> {
        return getConnection().getRepository(AnyChannel).createQueryBuilder("any_channel").where("any_channel.channel_id = :id", {id: id}).getOne();
    }


    async updateChannel() {
        await getConnection().getRepository(AnyChannel).createQueryBuilder("any_channel").update().set(this).where("any_channel.channel_id = :id", {id: this.channelId}).execute();
    }

    async createChannel() {
        await getConnection().getRepository(AnyChannel).createQueryBuilder("any_channel").insert().into(AnyChannel).values([this]).execute()
    }
}