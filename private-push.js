const exec = require('child_process').exec;
const pkd = require('./package');

function runCMD(command) {
    return new Promise((ok, fail) => {
        exec(command, (error, stdout, stderr) => {
            if (error !== null) {
                return fail(error);
            }
            if (stderr) {
                return fail(stderr);
            }
            ok(stdout);
        })
    });
}

function checkFileStatus() {
    return runCMD('git status --short').then(msg => {
        if (msg && msg.length > 0) {
            throw new Error('you have open changes in git repo, "commit" your open changes then rerun process!');
        }
        return true;
    });
}

function setRegistry(registryEndpoint) {
    return runCMD(`npm set registry ${registryEndpoint}`)
        .then(ok => {
            console.log(`[ok] Registry: ${registryEndpoint}`);
            return registryEndpoint;
        })
}

function checkUser(registry) {
    return runCMD(`npm whoami --registry ${registry}`)
        .then(user => {
            console.log(`[ok] User: ${user}`);
            return registry;
        });
}

function publish(registry, version) {
    return runCMD(`npm publish --registry ${registry}`)
        .then(e => {
            console.log(`[ok] published to registry ${registry}, version ${version}`);
        });
}

function bumpVersion() {
    return runCMD('npm version patch')
        .then(newVersion => {
            console.log(`[ok] version set to: ${newVersion}`);
            return newVersion;
        });
}

function runPublishJob(registryEndpoint) {
    return setRegistry(registryEndpoint)
        .then(registry => checkUser(registry))

        .then(registry => bumpVersion()
            .then(version => ({ version: version, registry: registry })))

        .then(job => publish(job.registry, job.version));
}

function main(pkd, reg) {
    console.log(`[start] publishing package: ${pkd.name}`);

    // 'http://192.168.99.100:32770'
    const registryEndpoint = pkd.publishConfig && pkd.publishConfig.registry ? pkd.publishConfig.registry : process.argv.slice(2)[0];

    return checkFileStatus()
        .then(ok => runPublishJob(registryEndpoint))
        .then(done => {
            console.log(`[end] yeah all done, don't forget to push changes to remote repo.`);
        })
        .catch(error => {
            console.error('[fail] process stop!');
            console.error(error);
        });
}

main(pkd);

