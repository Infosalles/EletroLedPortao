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