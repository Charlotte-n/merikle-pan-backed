import { WebSocketGateway } from '@nestjs/websockets';
import { YjsService } from './yjs.service';

@WebSocketGateway(1234)
export class YjsGateway {
  constructor(private yjsService: YjsService) {}

  handleConnection(client: any, ...args: any[]) {
    const [req] = args;
    if (req.url) {
      const [docName, userName] = req.url.slice(1).split('&&');
      this.yjsService.setupWSConnection(client, req, {
        docName,
        parameters: { userName },
      });
    } else {
      client.close();
    }
  }

  handleDisconnect() {
    console.log('client disconnected');
  }
}
