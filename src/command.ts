import fs from 'fs';
import { spawn } from 'child_process';
import colors from 'ansi-colors';

export interface Command {
  describe(): void;
  execute(): Promise<number>;
}

export class ExecCommand implements Command {
  public command: string;
  public args: string[];
  public cwd: string;

  public constructor(cwd: string, command: string, args: string[] = []) {
    this.cwd = cwd;
    this.command = command;
    this.args = args;
  }

  public describe(): void {
    console.log('> ExecCommand');
    console.log(`>   ${colors.cyan(`${this.command} ${this.args.join(' ')}`)}`);
  }

  public execute(): Promise<number> {
    return new Promise((resolve: (code: number) => void, reject: (err: unknown) => void): void => {
      spawn(this.command, this.args, {
        stdio: 'inherit',
        cwd: this.cwd
      }).on('error', reject).on('exit', resolve);
    });
  }
}

export class NpmCommand extends ExecCommand {
  public constructor(cwd: string, command: string[] | string) {
    if (typeof command === 'string') {
      command = [command];
    }
    super(cwd, 'npm', command);
  }
}

export class NpmRunCommand extends NpmCommand {
  public constructor(cwd: string, command: string, args: string[] = []) {
    super(cwd, ['run', command].concat(args));
  }
}

export class CopyCommand implements Command {
  public src: string;
  public dest: string;
  public constructor(src: string, dest: string) {
    this.src = src;
    this.dest = dest;
    if (!fs.existsSync(this.src) || !fs.lstatSync(this.src).isFile()) {
      throw new Error('Can only copy files');
    }
    /*if (!fs.existsSync(this.dest)) {
      throw new Error(`Dest does not exist: ${this.dest}`);
    }*/
  }

  public describe(): void {
    console.log('> CopyCommand');
    console.log(`   ${colors.cyan(this.src)}`);
    console.log(`   -> ${colors.green(this.dest)}`);
  }

  public async execute(): Promise<number> {
    fs.copyFileSync(this.src, this.dest);
    return 0;
  }
}