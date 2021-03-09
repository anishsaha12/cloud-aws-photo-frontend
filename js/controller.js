$(document).ready(function() {

    function get_query(q) {
        var searh_resp = [
            {
                'url': 'img/img-01.jpg',
                'labels': ['Hangers']
            },
            {
                'url': 'img/img-02.jpg',
                'labels': ['Perfumes']
            },
            {
                'url': 'img/img-03.jpg',
                'labels': ['Clocks']
            },
            {
                'url': 'img/img-04.jpg',
                'labels': ['Plants']
            },
            {
                'url': 'img/img-05.jpg',
                'labels': ['Morning']
            },
            {
                'url': 'img/img-06.jpg',
                'labels': ['Pinky']
            },
            {
                'url': 'img/img-07.jpg',
                'labels': ['Bus']
            },
            {
                'url': 'img/img-08.jpg',
                'labels': ['New York']
            },
            {
                'url': 'img/img-09.jpg',
                'labels': ['Abstract']
            },
            {
                'url': 'img/img-10.jpg',
                'labels': ['Flowers']
            },
            {
                'url': 'img/img-11.jpg',
                'labels': ['Rosy']
            },
            {
                'url': 'img/img-12.jpg',
                'labels': ['Rocki']
            },
            {
                'url': 'img/img-13.jpg',
                'labels': ['Purple']
            },
            {
                'url': 'img/img-14.jpg',
                'labels': ['Sea']
            },
            {
                'url': 'img/img-15.jpg',
                'labels': ['Turtle']
            },
            {
                'url': 'img/img-16.jpg',
                'labels': ['Peace']
            }
        ];
        return searh_resp;
    }
    
    $('#search-form').submit(function(e) {
        e.preventDefault();

        $('#search-result-display')[0].innerHTML = `
        <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
            <figure class="effect-ming tm-video-item">
                <img src="img/loading.gif" alt="Image" class="img-fluid">
                <figcaption class="d-flex align-items-center justify-content-center">
                    <h2>Loading</h2>
                </figcaption>
            </figure>
        </div>`;

        var input = $("#search-form :input[type='search']")[0];
        var query_term = input.value;
        console.log(query_term);
        
        // perform GET with query
        var search_resp = get_query(query_term);

        var html_result = search_resp.map(function(res){
            return `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                <figure class="effect-ming tm-video-item">
                    <img src="${res.url}" alt="Image" class="img-fluid">
                    <figcaption class="d-flex align-items-center justify-content-center">
                        <h2>${res.labels[0]}</h2>
                        <a href="${res.url}" target="_blank">View more</a>
                    </figcaption>
                </figure>
                <div class="d-flex justify-content-between tm-text-gray">
                    <span class="tm-text-gray-light">${res.labels.join(', ')}</span>
                </div>
            </div>`
        });

        if(html_result.length == 0){
            $('#search-result-display')[0].innerHTML = `
            <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                <figure class="effect-ming tm-video-item">
                    <img src="img/search.gif" alt="Image" class="img-fluid">
                    <figcaption class="d-flex align-items-center justify-content-center">
                        <h2>Find an Image</h2>
                    </figcaption>
                </figure>
            </div>`;
        }
        else{
            $('#search-result-display')[0].innerHTML = html_result.join('\n');
        }
    });

    $('#upload-form').submit(function(e) {
        e.preventDefault();

        var input_file = $("#upload-form :input[type='file']")[0];
        var custom_labels = $("#custom-labels")[0].value;

        var image = input_file.files[0];
        var image_name = input_file.files[0].name;
        var reader = new FileReader();
        reader.onload = function(){
            var image_data = reader.result;
            var parts = image_data.split(',');
            var image = parts[1];
            var type = parts[0].split(':')[1].split(';')[0]

            var settings = {
                "url": "https://pxfh8bitck.execute-api.us-east-1.amazonaws.com/v1/upload?name="+image_name,
                "method": "PUT",
                "headers": {
                    "x-amz-meta-customLabels": custom_labels ,
                    "Content-Type": type
                },
                "data": image
            };
    
            console.log(settings);

            $.ajax(settings).done(function (response) {
                console.log(response);
            });
        };
        reader.readAsDataURL(image);

    });

    $('#image-file').on('change', function () {
        var input = document.getElementById( 'image-file' );
        if (input.files && input.files[0]) {
            var reader = new FileReader();
    
            reader.onload = function (e) {
                $('#imageResult')
                    .attr('src', e.target.result);
            };
            reader.readAsDataURL(input.files[0]);
        }
    });
});
