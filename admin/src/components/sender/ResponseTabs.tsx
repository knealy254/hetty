import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Tab, Typography } from "@mui/material";
import { useState } from "react";
import { HttpResponseLog } from "../../generated/graphql";
import CenteredPaper from "../common/CenteredPaper";
import Editor from "../common/Editor";

import KeyValuePairTable from "./KeyValuePair";

export type ResponseTabsProps = {
  headers: HttpResponseLog["headers"];
  body: HttpResponseLog["body"];
  hasResponse: boolean;
};

enum TabValue {
  Body = "body",
  Headers = "headers",
}

const reqNotSent = (
  <CenteredPaper>
    <Typography>Response not received yet.</Typography>
  </CenteredPaper>
);

function ResponseTabs(props: ResponseTabsProps): JSX.Element {
  const { headers, body, hasResponse } = props;
  const [tabValue, setTabValue] = useState(TabValue.Body);

  const contentType = headers.find((header) => header.key.toLowerCase() === "content-type")?.value;

  const tabSx = {
    textTransform: "none",
  };

  return (
    <Box height="100%" sx={{ display: "flex", flexDirection: "column" }}>
      <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <TabList onChange={(_, value) => setTabValue(value)}>
            <Tab
              value={TabValue.Body}
              label={"Body" + (body?.length ? ` (${body.length} byte` + (body.length > 1 ? "s" : "") + ")" : "")}
              sx={tabSx}
            />
            <Tab
              value={TabValue.Headers}
              label={"Headers" + (headers.length ? ` (${headers.length})` : "")}
              sx={tabSx}
            />
          </TabList>
        </Box>
        <Box flex="1 auto" overflow="hidden">
          <TabPanel value={TabValue.Body} sx={{ p: 0, height: "100%" }}>
            {body && <Editor content={body} contentType={contentType} />}
            {!hasResponse && reqNotSent}
          </TabPanel>
          <TabPanel value={TabValue.Headers} sx={{ p: 0, height: "100%", overflow: "scroll" }}>
            {headers.length > 0 && <KeyValuePairTable items={headers} />}
            {!hasResponse && reqNotSent}
          </TabPanel>
        </Box>
      </TabContext>
    </Box>
  );
}

export default ResponseTabs;
