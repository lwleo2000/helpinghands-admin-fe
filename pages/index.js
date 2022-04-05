import { withRouter } from "next/router";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Login = dynamic(() => import("../components/Login/Login"), {
  ssr: false,
});

export default function Home() {
  return <Login />;
}
