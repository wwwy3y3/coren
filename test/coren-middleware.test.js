const corenMiddleware = require('../server/coren-middleware');

describe('coren-middleware', () => {
  it('init test', () => {
    const myMock = jest.fn();
    const middleware = corenMiddleware('./test/testExample/withBabelrc');
    middleware({}, {}, myMock);
    expect(myMock).toBeCalled();
  });

  describe('test res function', () => {
    let middleware;
    let res;
    let req;
    let mockSend;
    beforeEach(() => {
      mockSend = jest.fn();
      req = {};
      res = {send: mockSend};
      middleware = corenMiddleware('./test/testExample/withBabelrc');
      middleware(req, res, jest.fn());
    });

    it('return html', () => {
      res.sendCoren('index');
      expect(mockSend.mock.calls[0][0]).toMatchSnapshot();
    });

    it('setHead', () => {
      res.setHead(function($head) {
        $head.append('<script>hihihihi</script>');
      });
      res.sendCoren('index');
      expect(mockSend.mock.calls[0][0]).toMatchSnapshot();
    });

    it('setPreloadedState', () => {
      res.setPreloadedState({auth: false, user: 'john'});
      res.sendCoren('index');
      expect(mockSend.mock.calls[0][0]).toMatchSnapshot();
    });

    it('setHead & setPreloadedState', () => {
      res.setHead(function($head) {
        $head.append('<script>hihihihi</script>');
      });
      res.setPreloadedState({auth: false, user: 'john'});
      res.sendCoren('index');
      expect(mockSend.mock.calls[0][0]).toMatchSnapshot();
    });
  });
});
