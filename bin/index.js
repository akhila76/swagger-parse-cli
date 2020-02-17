#!/usr/bin/env node

const yargs = require("yargs");
const SwaggerParser = require("swagger-parser");
var Table = require('cli-table2')
const Sway = require('sway');

const opts = yargs
    .command(
        'list <filename>',
        'Lists all the paths specified in your spec',
        function (yargs) {
            return yargs.positional('filename', {
                describe: 'Filepath or URL to Swagger/OpenAPI spec',
                type: 'string',
                demandOption: true
            })
        },
        async function (argv) {
            
            Sway.create({
                definition: argv.filename
            })
            .then(function (apiDefinition) {
                // console.log('Documentation URL: ', apiDefinition.getPaths());
                var table = new Table({ style: { head: [], border: [] } });
                table.push(
                    [{ colSpan: 3, content: apiDefinition.info.title }],
                    ['Index', 'API', 'Operation']
                );
                totalOps = 0
                id = 1
                for (let path of apiDefinition.getPaths()) {
                    let Ops = path.getOperations();
                    table.push(
                        [id, path.path, Ops.length]
                    );
                    id += 1
                    totalOps += Ops.length
                }
                table.push(
                    ["Total", id-1, totalOps]
                );
                console.log(table.toString());
                
            }, function (err) {
                console.error(err.stack);
            });
        }
    )
    .showHelpOnFail(true)
    .demandCommand()
    .argv