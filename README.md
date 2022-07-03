# 开发日志-lhw
## 项目起始于 2022年6月8日
+ 6月8日 - 6月9日
    + 完成模块布局以及路由
+ 6月10日
    + 使用小规模城市模型，将城市模型在Three编辑器中查看组划分并进行修改，应用在项目中达到预期
        + 问题：
            + a.发现模型太小，无法起到预期效果
        + 解决：
            + a1.寻找更大的城市模型
    + 实现渐隐围墙Shader并配置一系列参数供修改呈现效果
+ 6月11日 - 6月12日
    + 找到上海市对应geoJson数据，将数据读取并构成模型
        + 问题:
            + a.发现帧率从120降到1、2帧
        + 解决:
            + a1.编写模型导出功能(GLTFExporter)，并将其放入Three编辑器中进行处理，在编辑器中查看发现有上万个几何体，在编辑器中直接处理并不现实
            + a2.在官网寻找到一个框选案例，将框选案例进行一些修改，实现一个具有框选合并(mergeBufferGeometries)几何体的功能并通过按键绑定实现'撤销选中','确定合并'等方便合并的操作去进行自定义合并几何体
            + a3.将几何体进行多次合并，并将合并后的几何体分次导出到Three编辑器进行结构整理(方便后续获取和增加结构清晰度)最终将上万个几何体合并为7大区域，为后面区域选择高亮Shader做准备
            + a4.在原有模型的基础上，再找一些大楼模型加入进城市模型，作为主要展示点
            + a5.模型从最开始的200MB合并到130MB，将模型再进行压缩，最后得到6MB大小模型
            + a6.总结 将geojson数据得到的模型进行模型合并导出到Three编辑器进行二次结构整理，最后将模型进行压缩 得到6MB城市模型
+ 6月13日
    + 找到上海的城市交通路线，地铁线数据，将数据读取并构成模型
        + 问题:
            + a.发现除所需数据之外还存在许多其他数据，这样构成的模型非常大，并且有许多不需要的线被绘制出来 大小为140MB
        + 解决:
            + a1.在处理城市模型的基础上，扩展按键绑定功能，通过查看线名称以及关键字来进行筛选，关键字包括'路' '地铁' '通道' '隧道' '大道' 这样就把80%的模型数据筛掉，该模型只压缩没有合并(为了后面流光线效果)
            + a2.最后大小2MB
+ 6月14日
    + 使用提取到的数据进行线合并
        + 问题:
            + a.发现13日提取出来的线，一整条路线上是分为多个短线链接起来的，想把这些每条路线上的'断线'合并为一整条路线
        + 解决:
            + a1.由于是通过Line绘制出来，单纯的利用以前的合并方法会出问题，具体画面可以参考将一堆点绘制为线，会显得杂乱，没有达到预期的效果
            + a2.最后用Node.js实现地铁线以及隧道等数据的筛选和提取并写入到json文件中
            + a3.线合并问题仍未解决，但是目前应该满足制作流光线的要求了，这里作为一个后续拓展点(如何去实现线的合并)
            + a4.整理了一下代码结构，分出许多小块，写了很多类来管理系统的每个块，提供了较多的扩展接口
+ 6月22日
  + 实现城市流光特效
+ 6月24日
  + 实现城市建筑扫描特效
+ 6月26日
  + 通过一些逻辑处理将地铁、主要道路、大道、隧道、通道数据完成提取，整理和顶点合并
+ 6月27日 - 7月2日
  + 抽空去学习了下blender，通过曲线修改器重新制作了一个标准的河流，同时打算将需要用到的物体的几何中心全部移到原点附近，以前的坐标需要靠包围盒来进行计算，这下直接导入即可
  + 这里吐槽一下，blender这些对于新手还是有很多坑的，预想的结果和实际的结果有时发现相差还是很大，好在问题都一一解决了
+ 7月3日-上午
  + 由于大道数据太少，所以删除了`大道`线条数据模型。
  + 重写了一下城市流线的生成逻辑，减少了很多逻辑代码。
  + 这里单独写出，算是总结了一下前几天的工作，下午写城市扩散光波
+ 7月3日-下午
  + 完成城市扩散光波


