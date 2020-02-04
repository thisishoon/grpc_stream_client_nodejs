/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
var PROTO_PATH = __dirname + '/media.proto';
var grpc = require('grpc');
var stream = require('stream');
var protoLoader = require('@grpc/proto-loader');

var fs = require('fs');
var wav = require('wav');
var Blob = require('blob');

var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
var grpc_client = grpc.loadPackageDefinition(packageDefinition);

function main() {
    let remote_server = '127.0.0.1:9999';
    var client = new grpc_client.MediaService(remote_server,
        grpc.credentials.createInsecure());
    var user;
    if (process.argv.length >= 3) {
        user = process.argv[2];
    } else {
        user = 'world';
    }
    // let rl = readline.createInterface({input: process.stdin, output:process.stdout});

    let c = client.filter();
    var file = fs.createReadStream('jo.wav');
    // reader.on('format',(format)=>{
    //     console.log(format);
    // })
    arr = [];
    file.on('data', (data) => {
        arr.push(data);
    });
    file.once('end', () => {
        c.write({raw: Buffer.concat(arr)});
    });
    // let result = node_wav.decode(file);
    // let data = result.channelData;
    // console.log(data[0].buffer);
    // //
    // for (let i of data){
    //     setTimeout(()=>{
    //         c.write({raw: [i.buffer]})
    //     },1000);
    // }
    // for (let _data of data) {
    //     //c.write({raw: _data});
    // }
    // for(let data of result.channelData[0])
    //     console.log(data);


    // let first = true;
    // file.on('data', (data) => {
    //
    //     var arrByte = new Float32Array(data)
    //     var binaryData = Buffer.from(arrByte)
    //     console.log('file');
    //     console.log(binaryData);
    //     c.write({raw: binaryData});
    // });
    // file.once('end', () => {
    //
    // });
    c.on('data', (data) => {
        console.log(data);


    });
    c.read();
    c.on('end', () => {
        console.log('end');
    })

}

main();