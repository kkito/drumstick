import * as http from 'http';

http
  .createServer((req, rep) => {
    console.log('serve: ' + req.url);
    console.log('serve: ' + req.rawHeaders);
    console.log('serve: ' + req.rawTrailers);
    rep.write('content!!!');
    rep.end();
  })
  .listen(3001);
