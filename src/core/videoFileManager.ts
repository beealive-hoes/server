import * as fs from "fs";


export default class VideoFileManager {

  private constructor() { }

  /**
   * This method will pop the newest video out of the stack and renames it to either **current.mp4**
   * 
   * @returns true if a new video has been popped, false if the stack was empty and the current current.mp4 is the same as before
   */
  public static pop(): boolean {
    let files = fs.readdirSync('./video');
    if (!files.includes('0.mp4')) return false;

    // Delete all files that for some reasons are not gone yet but should be
    if (files.includes('delete')) {
      fs.unlinkSync('./video/delete');
      files.splice(files.indexOf('delete'), 1);
    }

    // Move current.mp4 to make space
    if (files.includes('current.mp4')) {
      fs.renameSync('./video/current.mp4', './video/delete');
      files.splice(files.indexOf('current.mp4'), 1);
    }

    // Rename top of the stack to current.mp4
    files.sort();
    fs.renameSync('./video/0.mp4', './video/current.mp4');
    files.splice(0, 1);

    // Rename rest of the files to fit the stack
    for (let name of files) {
      let id = parseInt(name.split('.')[0]);
      id--;
      fs.renameSync(`./video/${name}`, `./video/${id}.mp4`);
    }

    setTimeout(() => {
      if (fs.existsSync('./video/delete'))
        fs.unlinkSync('./video/delete');
    }, 1000);
    return true;
  }

}