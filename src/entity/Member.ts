import { Column, Entity, getConnection, PrimaryGeneratedColumn } from "typeorm"
import { Snowflake } from "discord.js"

@Entity()
export class Member {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  discordId: string

  @Column({ default: 0 })
  points: number

  static async getMember(discordId: Snowflake): Promise<Member> {
    try {
      const result = await getConnection()
        .getRepository(Member)
        .createQueryBuilder("member")
        .where("member.discordId = :id", { id: discordId })
        .getOne()
      if (result === null) {
        const member = new Member()
        member.discordId = discordId
        await Member.createMember(member)
        return member
      }
      return result
    } catch {}
  }

  static async createMember(member: Member) {
    await getConnection()
      .getRepository(Member)
      .createQueryBuilder("member")
      .insert()
      .into(Member)
      .values([member])
      .execute()
  }

  async addPoints(points: number) {
    this.points += points
    await this.updateMember()
  }

  async updateMember() {
    return getConnection()
      .getRepository(Member)
      .createQueryBuilder("member")
      .update(Member)
      .set(this)
      .where("member.id = :id", { id: this.id })
      .execute()
  }
}
