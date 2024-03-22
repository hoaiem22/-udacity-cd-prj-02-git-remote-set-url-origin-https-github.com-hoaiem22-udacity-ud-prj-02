import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  app.get("/filteredimage", async (req, res) => {
    let { image_url } = req.query;
  
    if (!image_url) {
      res.status(400).send("Image Url must be not empty!");
    }
  
    // check the image_url is valid
    try {
      new URL(image_url);
    } catch (error) {
      return res.status(400).send({ message: "The image_url is not valid" });
    }
  
    // check the image exists and is accessible
    // const response = await axios.head(image_url);
    // if (response.status !== 200) {
    //   return res.status(400).send({ message: 'The image is not accessible' });
    // }
  
    try {
      const filteredImage = await filterImageFromURL(image_url);
      res.sendFile(filteredImage, () => deleteLocalFiles([filteredImage]));
    } catch (error) {
      console.log(error);
      res.status(422).send({ message: "Unable to process image at the provided url" });
    }
    // res.send("try GET /filteredimage?image_url={{}}");
  });

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
