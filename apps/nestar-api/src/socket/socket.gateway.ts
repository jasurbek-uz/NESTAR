import { Logger } from "@nestjs/common";
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from "ws";
import * as WebSocket from "ws";
import { AuthService } from "../components/auth/auth.service";
import * as url from 'url';
import { Member } from "../libs/dto/member/member";
import { AuthMember } from "../components/auth/decorators/authMember.decorator";

interface MessagePayload{
  event: string;
  text: string;
  memberData:Member
}
interface InfoPayload{
  event: string;
  totalClients: number;
  memberData: Member;
  action: string;
}
@WebSocketGateway({ tarnsports: ['websokect'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
  private summaryClient: number = 0;
  private clientsAuthMap = new Map<WebSocket, Member>()
  private messagesList: MessagePayload[] = [];

  constructor(private authService:AuthService){}
  
  @WebSocketServer()
  server: Server;
  
	public afterInit(server: Server) {
		this.logger.verbose(`Websoket Server Initialized & total [${this.summaryClient}]`);
  }
  
  private async retrieveAuth(req: any): Promise<Member>{
    try {
      const parseUrl = url.parse(req.url, true);
      const { token } = parseUrl.query;
      console.log('token:', token);
      return await this.authService.verifyToken(token as string);
    } catch (err) {
      return null;
    }
  }

 public async handleConnection(client: WebSocket, req: any) {
   const authMember = await this.retrieveAuth(req);
   console.log("authMember:", authMember)
   this.clientsAuthMap.set(client, authMember);
  
   const clientNick: string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`Connection  [${clientNick}] & total [${this.summaryClient}]`);
    
    const infoMsg: InfoPayload = {
      event: "info",
      totalClients: this.summaryClient,
      memberData: authMember,
      action:'joined',
    };

   this.emitMessage(infoMsg);
   // client message
   client.send(JSON.stringify({ event: "getMessage", list: this.messagesList }));
  }
  

  handleDisConnection(client: WebSocket) {
    const authMember = this.clientsAuthMap.get(client);
    this.summaryClient--;
    this.clientsAuthMap.delete(client);
    const clientNick: string = authMember?.memberNick ?? 'Guest';
    this.logger.log(`DisConnection [${clientNick}]  & total [${this.summaryClient}]`);
    
    const infoMsg: InfoPayload = {
			event: 'info',
      totalClients: this.summaryClient,
      memberData: authMember,
      action:'left',
    };
    
    //client -disconnection
    this.broadcastMessage(client, infoMsg);
  }
  
	@SubscribeMessage('message')
  public async handleMessage(client: any, payload: any): Promise<void>{
    const authMember = this.clientsAuthMap.get(client);
    const newMessage: MessagePayload = { event: "message", text: payload, memberData: authMember };
     const clientNick: string = authMember?.memberNick ?? 'Guest';
    this.logger.verbose(`NEW MESSAGE:   [${clientNick}]  ${payload}`);
    this.emitMessage(newMessage);

    this.messagesList.push(newMessage)
    if (this.messagesList.length > 5) this.messagesList.splice(0, this.messagesList.length - 5);

    this.emitMessage(newMessage);
  }
  
  private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
    this.server.clients.forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    })
  }
  
  private emitMessage(message: InfoPayload | MessagePayload) {
    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    })
  }
}


/*message target:
1.client(only client)
2.Broadcast (except client)
3.Emit(all clients)
 */ 

