# grunt-hoist

[![Code Climate](https://codeclimate.com/github/markmhx/grunt-hoist/badges/gpa.svg)](https://codeclimate.com/github/markmhx/grunt-hoist)
[![Code Climate issues badge](https://codeclimate.com/github/markmhx/grunt-hoist/badges/issue_count.svg)](https://codeclimate.com/github/markmhx/grunt-hoist/issues)
[![David badge](https://david-dm.org/markmhx/grunt-hoist.svg)](https://david-dm.org/markmhx/grunt-hoist)

This repository contains the source code for a suite of Grunt tasks to deploy Node.js apps to hosts and execute related remote procedures.

## Setup

To include this module in your package, simply run:

``` 
npm install grunt-hoist --save-dev
```

#### Environment variables

The following environment variables are managed by [Park Ranger](https://github.com/markmhx/park-ranger) and expected by tasks:

| Name                   | Required            | Description                                                  | Example          |
| :--------------------- | :------------------ | :----------------------------------------------------------- | :--------------- |
| HOIST_DEST_HOST        | yes                 | Hostname of remote server                                    | example.com      |
| HOIST_DEST_DIR         | yes                 | Directory on remote server for deployment of files           | /var/www/app     |
| HOIST_DEST_USER        | yes                 | User name for authentication to remote server                | webmaster        |
| HOIST_SYSTEMD_SERVICE  | no                  | Name of systemd service to start or restart upon deploy-app  | myapp            |

Additionally, the `ENV_NAME` variable used by Park Ranger is optionally used to determine filenames for app dependencies per below.


## App files

The following files located in the parent repository directory are deployed upon app deployment, as available:

- index.js
- Gruntfile.js
- package.json

After these app files are deployed, dependencies are automatically loaded on the host using two methods. The first is simply to call `npm install --production` to install dependencies that can be sourced from npm. The second is to copy all local dependencies listed in the parent repository's package with the `file:../` prefix to the parent directory of `HOIST_DEST_DIR` on the host to ensure their availability.

If the `HOIST_SYSTEMD_SERVICE` environment variable is available, a systemd service with corresponding name on the host will also be restarted or started, depending on its current runtime status.

## App dependencies

Certain files and directories in the parent repository directory are treated as app dependencies to be deployed given their filenames, as available.

These dependencies include those for environment variables (e.g. `.env`), configurations (e.g. `.config.json`) and SSL certificates (e.g. `.cert`). Their source and destination filenames are determined using both the `ENV_NAME` environment variable and a standard `-deploy` suffix. If no `ENV_NAME` value is available, they are located using just the suffix.

The following describes how file and directory names would be mapped with `ENV_NAME` available as value "example":

| Source                                      | Destination                                 |
| :------------------------------------------ | :------------------------------------------ |
| .cert-example-deploy                        | .cert-example                               |
| .config-example-deploy.json                 | .config-example.json                        |
| .env-example-deploy                         | .env-example                                |

And the following describes how they would be mapped without an `ENV_NAME` value available:

| Source                                      | Destination                                 |
| :------------------------------------------ | :------------------------------------------ |
| .cert-deploy                                | .cert                                       |
| .config-deploy.json                         | .config.json                                |
| .env-deploy                                 | .env                                        |

Note that the destination value is relative to the directory on the host indicated by `HOIST_DEST_DIR`. The source value is relative to the parent repository base directory.

## Scripts

Installation of this package as a dependency makes the following scripts available automatically:

| Command                         | Description                     |
| :------------------------------ | :------------------------------ |
| npm run deploy-all              | Deploys app and dependencies    |
| npm run deploy-app              | Deploys app files               |
| npm run deploy-dependencies     | Deploys dependencies            |