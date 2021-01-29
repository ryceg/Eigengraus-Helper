import {Column, Entity, getConnection, PrimaryColumn} from "typeorm";

@Entity()
export class Channel {
    @PrimaryColumn()
    id: string;

    @Column()
    length: number;

    @Column({nullable: true})
    lastListId: number;

    public static async getChannel(id: string): Promise<Channel> {
        return getConnection().getRepository(Channel).createQueryBuilder("channel").where("channel.id = :id", {id: id}).getOne();
    }

    public async createChannel() {
        await getConnection().getRepository(Channel).createQueryBuilder("channel").insert().into(Channel).values([this]).execute();
    }

    public static async updateChannel(channel: Channel) {
        return getConnection().getRepository(Channel).createQueryBuilder("channel").update(Channel).set(channel).where("channel.id = :id", {id: channel.id}).execute();
    }
}