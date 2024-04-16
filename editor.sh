curl -i -X POST \
  https://api.deno.com/v1/organizations/5de101ce-7bfc-4e70-8883-e3951ab03778/projects \
  -H 'Authorization: Bearer ddo_pbsGkurpF22myT8bvyzyGZDLYAAOZB0KHuYN' \
  -H 'Content-Type: application/json' \
  -d '{ "description": "monaco editor" }'
 ###
   
  
  curl -i -X POST \
    'https://api.deno.com/v1/projects/5476567c-b7c6-419d-a143-097387fe8879/deployments' \
    -H 'Authorization: Bearer ddo_pbsGkurpF22myT8bvyzyGZDLYAAOZB0KHuYN' \
    -H 'Content-Type: application/json' \
    -d '{
      "entryPointUrl": "main.ts",
      "assets": {
        "main.ts": {
          "kind": "file",
          "content": "Deno.serve((req: Request) => new Response(\"Hello World\"));"
        }
      },
      "envVars": {},
      "description": "My first deployment"
    }'