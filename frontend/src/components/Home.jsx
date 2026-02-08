import React, { useState, useEffect, useRef } from "react";
import Styles from "../styles/Home.module.css";
import { useParams } from "react-router-dom";

function Home({ designation }) {
  const { role } = useParams();
  return (
    <div className={Styles.container}>
      <div className={Styles.main}>
        <div className={Styles.content}>
          <div className={Styles.info}>
            <p>
              Hi, I am <strong>ANUJ VERMA</strong>{" "}
            </p>{" "}
            <p>
              I am an <strong>IITian</strong> and a{" "}
              <strong>{designation}</strong>
            </p>
          </div>
          <div className={Styles.backgroundSkills}>
            {role == "SDE" ? (
              <>
                <img src="/images/kafka.png" />
                <img src="/images/react.png" />
                <img src="/images/mongodb.png" />
                <img src="/images/python.png" />
                <img src="/images/html.png" />
                <img src="/images/css.png" />
                <img src="/images/js.jpg" />
                <img src="/images/git.png" />
                <img src="/images/docker.png" />
                <img src="/images/jenkins.png" />
                <img src="/images/redis.png" />
                <img src="/images/node.png" />
              </>
            ) : (
              <>
                <img src="/images/blender.png" />
                <img src="/images/unity.png" />
                <img src="/images/csharp.png" />
                <img src="/images/unreal.jpg" />
                <img src="/images/maya.png" />
                <img style={{filter: "invert(1)"}} src="/images/zbrush.png" />
                <img src="/images/substance.png" />
                <img src="/images/photoshop.png" />
                <img src="/images/illustrator.jpg" />
                <img src="/images/aftereffects.jpg" />
                <img src="/images/premiere.jpg" />
                <img src="/images/davinci.png" />
                <img src="/images/marvelous.png" />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
