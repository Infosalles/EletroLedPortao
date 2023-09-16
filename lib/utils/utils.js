const loadingArr = [];

function updateLoadingState() {
    const body = document.body;

    let loadingPlaceholder = document.getElementById("loading");
    if (!loadingPlaceholder) {
        // let container = document.querySelector('body>.container');
        
        loadingPlaceholder = document.createElement('div');
        loadingPlaceholder.id = "loading";

        let loaderPlaceholder = document.createElement('div');
        loaderPlaceholder.classList.add("loader");
        loadingPlaceholder.appendChild(loaderPlaceholder);

        body.appendChild(loadingPlaceholder);
    }
    
    if (loadingArr.length > 0) {
        body.classList.add("loading-data");
    }
    else {
        body.classList.remove("loading-data");
    }
}

export function addLoading(id) {
    loadingArr.push(id);
    updateLoadingState();
}

export function removeLoading(id) {
    if (loadingArr.some(s => s == id)) {
        loadingArr.splice(loadingArr.indexOf(id), 1);
    }
    updateLoadingState();
}

/**
 * 
 * @param {string} message 
 * @param {('primary'|'secondary'|'success'|'danger'|'warning'|'info'|'light'|'dark')} type 
 */
export function alert(message, type) {
    let alertPlaceholder = document.getElementById('liveAlertPlaceholder');
    if (!alertPlaceholder) {
        alertPlaceholder = document.createElement('div');
        alertPlaceholder.id = "liveAlertPlaceholder";
        document.body.appendChild(alertPlaceholder);
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        '</div>'
    ].join('');

    alertPlaceholder.append(wrapper);
}

/**
 * 
 * @returns {string}
 */
export function getBaseURL() {
    let parts = location.href.split('/').filter(s => s != '' && s != location.protocol);
    let host = location.host.toLowerCase();
    let hostname = location.hostname.toLowerCase();
    let basename = 'EletroLedPortao'.toLowerCase();
    let endsWithSlash = location.href.endsWith('/');

    for (let i = parts.length - 1; i >= 0; i--) {
        let part = parts[i].toLowerCase();
        if (host == part || hostname == part || basename == part) break;
        parts.pop();
    }
    let baseURL = `${location.protocol}//${parts.join('/')}${endsWithSlash ? '/' : ''}`;
    return baseURL;
}