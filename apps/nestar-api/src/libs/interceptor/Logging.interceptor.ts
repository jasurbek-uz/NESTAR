import { Injectable, NestInterceptor, ExecutionContext, CallHandler, Logger } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from "@nestjs/graphql";
import { stringify } from "querystring";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger: Logger = new Logger();

 public intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const recordTime = Date.now();
    // const type = context.getType();
    const requestType = context.getType<GqlContextType>();
    
    if (requestType === "http") {
      // Develop if needed! 
    } else if (requestType === 'graphql') {
      // (1) Print request
      const gqlContext = GqlExecutionContext.create(context);
      console.log('gqlContext =>', gqlContext.getContext().req.body);
      this.logger.log(`${this.stringify(gqlContext.getContext().req.body)}`, 'REQUEST')
      // (2) Errors handling via Graphql
      
      // (3) No errors giving Response below
    return next.handle().pipe(
      tap((context) => {
        const responseTime = Date.now() - recordTime;
        this.logger.log(`${this.stringify(context)} -${responseTime}ms \n\n`, "RESPONSE")
      }),
    );
		}
  }
  
  private stringify(context: ExecutionContext): string{
    console.log(typeof context);
    return JSON.stringify(context).slice(0, 75);
  }
}
