exports.Expires = {

    fileMatch:/^(gif|png|jpg|js|css)$/ig,
    maxAge:60
};

exports.Compress = {
    match:/css|js|html/ig
};

exports.Welcome = {
    file:"index.html"
};
