curl -X PUT 'https://idconnect.api.extrimian.com/AOZJ1bJn6ieMeh2hDk6N/3QIlryal1dFM0fSu/ssi/v1/credentialsbbs/waci/oob/presentation' \
  --header 'apikey:tozRgKWwHTQWYWnFc7gkML0l2KEGBlP8' \
  --header 'Content-Type: application/json' \
  --header 'Accept: application/json' \
  --data-raw $'{
  "did": "did:quarkid:EiBbWEmtw7by7ECit6JTo9dM1J9pwo3j38fH1G_yj6k_YA",
  "inputDescriptors": [
      {
          "id": "HotelRoomCredential",
          "name": "HotelRoomCredential",
          "constraints": {
              "fields": [
                  {
                      "path": [
                          "$.credentialSubject.guestName"
                      ],
                      "filter": {
                          "type": "string"
                      }
                  },
                  {
                      "path": [
                          "$.credentialSubject.roomNumber"
                      ],
                      "filter": {
                          "type": "string"
                      }
                  }
              ]
          }
      }
  ]
}'