---
sidebar_position: 1
---

# Top Page

让我们 **用 5 分钟简单了解下 Top Page**.

## 为什么要开启这个项目

我在家中使用 Docker 部署了多个服务，最初使用开源项目 **[homepage](https://github.com/gethomepage/homepage)** 来搭建门户页面。但在使用中发现了一些不足之处：

首先，homepage 缺少权限控制功能，比如家人不需要看到 Nginx 配置界面，但管理员应能访问所有服务页面。

其次，基于 Web 的生态缺乏消息通知等能力，而手机客户端可以更灵活地实现这些功能。因此，我决定开发一个跨平台、配置简单的门户项目，具备权限管理和移动端的增强功能，为不同用户提供更便捷的访问体验。

## 哪些人可以使用这个项目

1. **个人 geek：** 家中部署多个服务，想要让家里人也能便捷的使用这些服务
2. **企业：** 公司有多个服务，可以让员工手机或电脑中也能根据权限便捷访问这些服务

## 目前进展

使用 `React Native` 搭建了最基础的 `MVP` 应用，有安卓客户端和 IOS 客户端

## 未来

- [ ] 完善的权限管理
- [ ] 方便的的配置界面
- [ ] 后台配置界面
- [ ] notification 和其它原生能力
- [ ] electron 客户端（Mac, Windows）
- [ ] web 页面

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.
