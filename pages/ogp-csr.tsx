import { useState, useEffect } from "react";
import { Container, Text, Box, Link, VStack, Image } from "@chakra-ui/react";
import openGraphScraper from "open-graph-scraper";

type Status = "idle" | "loading" | "complete";

type OGPProps = { url: string };
function OGP({ url }: OGPProps) {
  const [status, setIsLoading] = useState<Status>("idle");
  const [ogImage, setOgImage] = useState<string>("");
  const [ogTitle, setOgTitle] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsLoading("loading");
    (async () => {
      try {
        const data = await openGraphScraper({
          url,
          onlyGetOpenGraphInfo: true,
        });
        if (data.result.success) {
          setOgTitle(data.result.ogTitle);
          setOgImage(data.result.ogImage.url);
        }
      } catch (_) {
      } finally {
        setIsLoading("complete");
      }
    })();
  }, []);

  if (status !== "complete") {
    return <></>;
  }

  if (Boolean(ogImage)) {
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
            src={ogImage}
            alt={ogTitle}
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
            <Text>{ogTitle}</Text>
            <Text color="gray.500">{url}</Text>
          </Box>
        </VStack>
      </Link>
    </Box>
  );
}

type PageProps = {};
export default function Page(props: PageProps) {
  return (
    <Container centerContent>
      <OGP url="https://natgeo.nikkeibp.co.jp/atcl/news/21/012000029/" />
    </Container>
  );
}
