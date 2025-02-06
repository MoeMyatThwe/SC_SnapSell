//To avoid repeating the same token check in every request, 
// create a reusable function for API calls that handles both expired and invalid tokens.

function sendApiRequest(url, method, data, successCallback, errorCallback) {
    const token = localStorage.getItem('token');
    $.ajax({
        headers: { "authorization": "Bearer " + token },
        url: url,
        type: method,
        contentType: "application/json",
        dataType: "json",
        data: data ? JSON.stringify(data) : null,
        success: function (response, textStatus, xhr) {
            successCallback(response);
        },
        error: function (xhr, textStatus, err) {
            if (xhr.status === 401) {
                alert('Your session has expired. Please log in again.');
                window.localStorage.clear();
                window.location.assign("http://localhost:3001/loginPage.html");
            } else if (xhr.status === 403) {
                alert('Unauthorized access! Please log in.');
                window.localStorage.clear();
                window.location.assign("http://localhost:3001/loginPage.html");
            } else {
                console.error('Error:', err);
                alert('An unexpected error occurred.');
            }
            if (errorCallback) {
                errorCallback(err);
            }
        }
    });
}
