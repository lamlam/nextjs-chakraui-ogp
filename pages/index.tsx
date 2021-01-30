import Head from "next/head";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import openGraphScraper from "open-graph-scraper";
import {
  Container,
  Text,
  Box,
  Link,
  VStack,
  Image,
  Heading,
} from "@chakra-ui/react";

type OGPData = { url: string; title?: string; image?: string };
function OGP({ url, title, image }: OGPData) {
  if (!image) {
    return (
      <Link color="teal.500" href={url} isExternal>
        {url}
      </Link>
    );
  }

  return (
    <Box maxWidth="md">
      <Link href={url} isExternal>
        <VStack
          borderRadius="xl"
          border="1px"
          borderColor="gray.400"
          spacing={0}
        >
          <Image
            src={image}
            alt={title}
            width="100%"
            maxHeight="2xs"
            borderTopRadius="xl"
            objectFit="cover"
          />
          <Box
            borderBottomRadius="xl"
            borderTop="1px"
            borderColor="gray.400"
            padding="3"
            width="100%"
          >
            <Text>{title}</Text>
            <Text color="gray.500">{url}</Text>
          </Box>
        </VStack>
      </Link>
    </Box>
  );
}

export default function Home({
  ogpData,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Container centerContent>
      <Head>
        <title>OGP with Nextjs + ChakraUI</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Heading>OGP with Nextjs + ChakraUI</Heading>
      <OGP {...ogpData} />
    </Container>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const url = "https://natgeo.nikkeibp.co.jp/atcl/news/21/012000029/";
  const data = await openGraphScraper({
    url,
    onlyGetOpenGraphInfo: true,
  });
  if (!data.result.success) {
    return { props: { ogpData: { url } } };
  }

  return {
    props: {
      ogpData: {
        url,
        title: data.result.ogTitle,
        image: data.result.ogImage.url,
      },
    },
  };
};
