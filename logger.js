const request = require('request');
const { exec } = require('child_process');

const { url } = require('./url');

console.log();
console.log("Slack Logger is now on");
console.log("It will send all logs from this terminal to the logs slack channel in the Bhagat workspace");
console.log("Use the on command to test if the logger is on");
console.log("Click Ctrl C to stop the logger or type in exit");
console.log();

request.post(
    {
        headers : { 'Content-type' : 'application/json' },
        url,
        form : JSON.stringify({ text: new Date().toString().split(' ').splice(0, 5).join(' ') + ": Starting Logger . . ." }),
    },
    (error, res, body) => null
);

let curDir = __dirname;

process.stdout.write(curDir + ">");


process.openStdin().addListener("data", data => {

    data = data.toString().trim();

    if(data === 'exit')
        process.exit();

    if(data === 'on') {
        console.log();
        console.log("Yes the logger is still on");
        console.log();
        process.stdout.write(curDir + ">");
        return;
    }

    if(data.substring(0, 2) === 'cd') {
        let dirCommand = data.substring(2);
        if(dirCommand.substring(0, 1) == ' ')
            dirCommand = dirCommand.substring(1);
        
        const oldDir = curDir;

        switch(dirCommand) {
            case '.':
                break;

            case '':
                if(process.platform === "win32")
                    exec('cd', {
                        cwd: curDir
                    }, (_, stdout, stderr) => {
                        console.log();
                        console.log('stdout:');
                        console.log(stdout);
                        console.log('stderr:');
                        console.log(stderr);
                    });
                break;
            case '..':
                const splitChar = process.platform === "win32"? '\\' : '/';
                curDir = curDir.split(splitChar).splice(0, curDir.split(splitChar).length - 1).join(splitChar);
                break;

            default:
                if(dirCommand.substring(0, 2) === 'C:')
                    curDir = dirCommand;
                else
                    curDir += process.platform === "win32"? "\\" : "/" + dirCommand;
        }

        exec('ls', {
            cwd: curDir
        }, (_, stdout, stderr) => {
            if(stdout === '') {
                console.log('The path specified does not exist or is empty.')
                curDir = oldDir;
            }
            console.log();
            process.stdout.write(curDir + ">");
        })

        return;

    }

    console.log();
    console.log('stdout:');

    request.post(
        {
            headers : { 'Content-type' : 'application/json' },
            url,
            form : JSON.stringify({ text: new Date().toString().split(' ').splice(0, 5).join(' ') + ": Running " + curDir + ">" + data }),
        },
        (error, res, body) => null
    );

    exec(data, {
        cwd: curDir
    }, (_, stdout, stderr) => {
        console.log('stderr:');
        console.log(stderr);

        if(stderr !== '')
            request.post(
                {
                    headers : { 'Content-type' : 'application/json' },
                    url,
                    form : JSON.stringify({ text: new Date().toString().split(' ').splice(0, 5).join(' ') + ": " + stderr }),
                },
                (error, res, body) => null
            );

        process.stdout.write(curDir + ">");
    }).stdout.on("data", data => {
        console.log(data.toString().trim());
        request.post(
            {
                headers : { 'Content-type' : 'application/json' },
                url,
                form : JSON.stringify({ text: new Date().toString().split(' ').splice(0, 5).join(' ') + ": " + data.toString().trim() }),
            },
            (error, res, body) => null
        );
    });;
});

process.on('exit', () => {
    console.log();
    console.log("Stopping Slack Logger . . .");
});
process.on('SIGINT', () => {
    console.log();
    process.exit();
});