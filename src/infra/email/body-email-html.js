const bodyEmailHtml = (token) => {
    return `<!DOCTYPE html>
        <html>
        <head>
        <style>
            .container {
                margin: 10% 20%;
                border-radius: 10px;
                background-color: white;
            }
              
            .title {
                padding: 1% 0% 0%;
                text-align: center
            }
               
            p {
                color:blue;
                text-align: center;
                font-family: Arial, sans-serif;
                font-size: 30px;
                padding-bottom: 5%;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="title">
                    <h3>Use the token below to finish login.</h3>
                </div>
                <hr/>
                <p>${token}</p>
            </div>
        </body>
        </html>`;
};

export default bodyEmailHtml;