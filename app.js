#! /usr/local/bin/node
const NodeID3 = require('node-id3');
const fs = require('fs');
const { promisify } = require('util');
const path = require('path');
const readdir = promisify(fs.readdir);


async function doWork() {
  let fileNames;
  try {
    const wd = process.cwd();
    fileNames = await readdir(wd);
    fileNames = fileNames.filter(file => file.includes('.mp3'))
                         .map(file => file.replace('.mp3', ''));
    if (fileNames.length === 0) {
      console.log('There are no mp3 files in this directory. Exiting...'); // eslint-disable-line
      return;
    }
    console.log('At end, be sure to drag & drop the mp3 into iTunes, and change to Audiobook.'); // eslint-disable-line
    console.log('Test in the iBooks app on iPhone to test that it sorted it correctly (using the 3 lined icon in top right after pressing on the book image icon in iBooks)'); // eslint-disable-line
    console.log('\nFiles to work on...', fileNames); // eslint-disable-line
    
    console.log('\n Beginning work (will be finished when prompt frees up)...'); // eslint-disable-line
    fileNames.forEach((file) => {
      const filePath = path.join(wd, `${file}.mp3`);
      NodeID3.read(filePath, (err, tags) => {
        if (err) {
          console.log('err', err); // eslint-disable-line
        }
        
        tags.title = file;
        NodeID3.update(tags, filePath, (err) => {
          if (err) {
            console.log('err', err); // eslint-disable-line
          }
        });
      });
    });
  } catch(e) {
    console.log(`Couldn't read any files from path ${wd}`); // eslint-disable-line
  }
  
  
}

doWork()
