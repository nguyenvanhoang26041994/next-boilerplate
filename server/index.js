const express = require('express');
const next = require('next');
const compression = require('compression');
const LRUCache = require('lru-cache');

const ssrCache = new LRUCache({
  max: 1 * 1024 * 1024,
  length: function (n, key) {
    return n.length
  },
  maxAge: 60 * 1000, // ten seconds
});

const asking = {
  '_next': 'NO-CACHE',
  'static': 'NO-CACHE',
};

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const renderAndCache = async (req, res, path, query) => {
  const key = `${path || req.path}`;

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    res.setHeader('x-cache', 'HIT');
    res.send(ssrCache.get(key));
    return
  }

  try {
    // If not let's render the page into HTML
    const html = await app.renderToHTML(
      req,
      res,
      path || req.path,
      query || req.query
    );

    // Something is wrong with the request, let's skip the cache
    if (res.statusCode !== 200) {
      res.send(html);
      return;
    }

    // Let's cache this page
    ssrCache.set(key, html);

    res.setHeader('x-cache', 'MISS');
    res.send(html);
  } catch(err) {
    app.renderError(
      err,
      req,
      res,
      path || req.path,
      query || req.query
    );
  }
};

app
  .prepare()
  .then(() => {
    const server = express();

    server.use(compression());
    server.use('/', express.static('.next'));
    server.use(express.static('static'));

    server.get('/_next/*', (req, res) => handle(req, res));
    server.get('/static/*', (req, res) => handle(req, res));

    server.get('/profile/:id', (req, res) => {
      return renderAndCache(req, res, '/profile', { id: req.params.id });
    });

    server.get('*', (req, res) => {
      const question = req.path.split('/')[0];
      const shouldCache = !dev && asking[question] !== 'NO-CACHE';

      if (shouldCache) {
        return renderAndCache(req, res);
      }

      return handle(req, res);
    });

    server.listen(process.env.PORT || 3000, err => {
      if (err) throw err;
      console.log('> Ready on http://localhost:3000');
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
