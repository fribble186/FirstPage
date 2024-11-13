import clsx from "clsx";
import Heading from "@theme/Heading";
import styles from "./styles.module.css";

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<"svg">>;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: "配置安全简单",
    Svg: require("@site/static/img/undraw_docusaurus_mountain.svg").default,
    description: (
      <>
        该项目是一个用于管理和访问自建服务的门户。 通过加密的 JSON
        文件地址进行配置服务，帮助用户方便地将自己部署的各类服务的访问入口集中管理。
      </>
    ),
  },
  {
    title: "简单的权限管理",
    Svg: require("@site/static/img/undraw_docusaurus_tree.svg").default,
    description: (
      <>
        通过配置不同的 JSON
        文件和密码，简便地实现了基于用户权限的服务可见性控制，使不同人员可以根据其权限访问相应的服务。
      </>
    ),
  },
  {
    title: "多平台",
    Svg: require("@site/static/img/undraw_docusaurus_react.svg").default,
    description: (
      <>
        项目基于 React 技术栈，通过 React Native 和 Electron 实现
        Android、iOS、Windows、macOS 和 Web
        多平台支持，方便用户在各端访问和管理自建服务
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx("col col--4")}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
