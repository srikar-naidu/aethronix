"use client";

import Spline from '@splinetool/react-spline';

export default function SplineScene() {
  return (
    <div className="w-full h-full min-h-[400px] lg:min-h-[500px]">
      <Spline
        scene="https://prod.spline.design/qxMH3q0OeEvwqXVm/scene.splinecode"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
