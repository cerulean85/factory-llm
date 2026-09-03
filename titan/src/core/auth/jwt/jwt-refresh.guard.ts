import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { DEBUG_JWT_ENABLED } from "src/config/debug.config";

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  canActivate(context: ExecutionContext) {
    if (!DEBUG_JWT_ENABLED) {
      return true;
    } else {
      return super.canActivate(context);
    }
  }
}