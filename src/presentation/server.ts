import app from "./app";
import ENV from "./core/config/env";

const server = app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});

// Live location streams (SSE, GET /routes/:id/location/stream) keep a response open for as long
// as the client is connected, so Node's HTTP timeouts must not cut them:
// - keepAliveTimeout only applies to idle keep-alive sockets (between requests), not to an
//   in-flight response. It is raised above the usual 60 s proxy idle timeout (Coolify/Traefik/
//   nginx/ALB) so the proxy never reuses a socket Node has already closed (502s);
//   headersTimeout must be larger than keepAliveTimeout.
// - requestTimeout (default 300 s in Node 18+) only limits the time to RECEIVE the whole
//   request, not the response, so open SSE responses are not affected; it is left at the default.
// - server.timeout is 0 (disabled) by default since Node 13; the controller additionally calls
//   socket.setTimeout(0) on the stream's socket.
server.keepAliveTimeout = 65_000;
server.headersTimeout = 66_000;
