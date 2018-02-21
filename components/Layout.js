import React from "react";
import Head from "next/head";
import "semantic-ui-css/semantic.min.css";

export default props => {
  return (
    <div>
      <Head>
        <title>Kickstarter DApp</title>
        <link
          rel="stylesheet"
          href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"
        />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      {props.children}
      <div>Footer</div>
    </div>
  );
};
