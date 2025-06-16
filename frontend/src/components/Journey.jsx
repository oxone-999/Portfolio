import React from "react";
import Styles from "../styles/journey.module.css";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineOppositeContent,
} from "@mui/lab";
import { Typography, Paper, Avatar } from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LaptopMacIcon from "@mui/icons-material/LaptopMac";

import journeyData from "../assets/journey";

const iconMap = {
  school: <SchoolIcon />,
  internship: <LaptopMacIcon />,
  job: <WorkIcon />,
};

function Journey() {
  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content}>
          <div className={Styles.timeline}>
            <Timeline position="alternate">
              {journeyData.map((item, index) => (
                <TimelineItem key={index}>
                  <TimelineOppositeContent
                    sx={{ m: "auto 0" }}
                    align="right"
                    variant="body2"
                    color="text.secondary"
                  >
                    {item.duration}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineDot color="primary">
                      {iconMap[item.type]}
                    </TimelineDot>
                    {index !== journeyData.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent sx={{ py: "12px", px: 2 }}>
                    <Paper
                      elevation={3}
                      sx={{
                        p: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flexDirection: "row",
                      }}
                    >
                      <Avatar src={item.logo} alt={item.company} />
                      <div>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.company}
                        </Typography>
                        <Typography variant="caption" color="primary">
                          {item.typeLabel}
                        </Typography>
                      </div>
                    </Paper>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Journey;
