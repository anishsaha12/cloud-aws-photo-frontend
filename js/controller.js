$(document).ready(function() {

    var apigClient = apigClientFactory.newClient();

    function get_query(q) {
        var search_resp = [
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
        
        return apigClient.searchGet({
            'q':q
        }).then(function(result){
            search_resp = result.data.results;
            return search_resp;
        }).catch( function(result){
            return [];
        });
    }

    function makeblob(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
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

        if(query_term == ''){
            alert('Enter a query');
            $('#search-result-display')[0].innerHTML = `
                <div class="col-xl-3 col-lg-4 col-md-6 col-sm-6 col-12 mb-5">
                    <figure class="effect-ming tm-video-item">
                        <img src="img/search.gif" alt="Image" class="img-fluid">
                        <figcaption class="d-flex align-items-center justify-content-center">
                            <h2>Find an Image</h2>
                        </figcaption>
                    </figure>
                </div>`;
            return;
        }
        
        // perform GET with query
        get_query(query_term).then(function(search_resp){
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
    });

    $("#contains-person").change(function() {
        if(this.checked) {
            $('#person-name').show();
            $('#person-name').val("");
        }else{
            $('#person-name').hide();
            $('#person-name').val("");
        }
    });

    $('#upload-form').submit(function(e) {
        e.preventDefault();

        var input_file = $("#upload-form :input[type='file']")[0];
        var custom_labels = $("#custom-labels")[0].value;

        if($("#contains-person").is(":checked")){
            custom_labels += ', name_'+ $('#person-name').val();
        }

        var image = input_file.files[0];
        var image_name = image.name;
        var type = image.type;
        var reader = new FileReader();
        reader.onload = function(){
            var image_data = reader.result;
            var image_blob = makeblob(image_data);
            var settings = {
                "url": "https://pxfh8bitck.execute-api.us-east-1.amazonaws.com/v1/upload?name="+image_name,
                "method": "PUT",
                contentType: 'application/octet-stream',
                processData: false,
                "headers": {
                    "x-amz-meta-customLabels": custom_labels ,
                    "Content-Type": type
                },
                "data": image_blob
            };
            $.ajax(settings).done(function (response) {
                alert("Uploaded!!");
                console.log(response);
            });
            // apigClient.uploadPut({
            //     'name':image_name,
            //     'x-amz-meta-customLabels': custom_labels,
            //     'Content-Type': type,
            //     'Accept': '*'
            // },image_blob).then(function(result){
            //     console.log('UPLOADED');
            //     console.log(result);
            // }).catch( function(result){
            //     console.log('Failed');
            //     console.log(result);
            // });
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
