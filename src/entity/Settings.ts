import { Column, Entity, getConnection, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export class Settings {
  @PrimaryGeneratedColumn()
  id: number
  @Column({ default: false })
  anarchyPosting: boolean

  @Column({ default: false })
  autoPosting: boolean

  static async getSettings(): Promise<Settings> {
    return getConnection()
      .getRepository(Settings)
      .createQueryBuilder("settings")
      .getOne()
  }
}
