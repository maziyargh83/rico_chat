export enum status {
  public,
  private,
}
export class createConversation {
  constructor(
    public title: string,
    public description: string,
    public status: status
  ) {}
}
