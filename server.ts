import next from 'next'

import { join } from 'path'
import { parse } from 'url'
import { createServer } from 'http'

const port = parseInt(process.env.PORT || '3000', 10)

const dev = process.env.NODE_ENV !== 'production'

const FRONTEND_BASEURL = "/frontend";
const FRONTEND_MODULE = join(__dirname, "frontend");

const DASHBOARD_BASEURL = "/dashboard";
const DASHBOARD_MODULE = join(__dirname, "dashboard");

const dashboard = next({ dev, dir: DASHBOARD_MODULE, conf: { basePath: DASHBOARD_BASEURL } })

const frontend = next({ dev, dir: FRONTEND_MODULE, conf: { basePath: FRONTEND_BASEURL } })

const handle_frontend = frontend.getRequestHandler()

const handle_dashboard = dashboard.getRequestHandler()

async function main() {
  await Promise.all([frontend.prepare(), dashboard.prepare()]);

  createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)

    const { pathname, query } = parsedUrl

    if (pathname?.startsWith(DASHBOARD_BASEURL)) {
      handle_dashboard(req, res, parsedUrl)
    } else {
      handle_frontend(req, res, parsedUrl)
    }

  }).listen(port)

}

main()