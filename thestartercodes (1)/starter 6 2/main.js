const path = require("path");
/*
 * Project: Milestone 1
 * File Name: main.js
 * Description:
 *
 * Created Date:
 * Author:
 *
 */

const IOhandler = require("./IOhandler");
const zipFilePath = path.join(__dirname, "myfile.zip");
const pathUnzipped = path.join(__dirname, "unzipped");
const pathProcessed = path.join(__dirname, "grayscaled");

async function main() {
    await IOhandler.unzip(zipFilePath, pathUnzipped);
    files = await IOhandler.readDir(pathUnzipped);
    // for (const file of files) {
    //     await IOhandler.inverted(path.join(pathUnzipped, file), path.join(pathProcessed, file));
    // };

    for (const file of files) {
        await IOhandler.grayscaled(path.join(pathUnzipped, file), path.join(pathProcessed, file));
    }};

main();