import * as THREE from 'three'
export default class Track {
    sources!: Set<any>;
    /**
     * @track 捕获需要释放的对象
     * @trackByScene 从场景中捕获所有可释放的对象
     * @disTrack 删除已经捕获的对象
     * @allDisTrack 释放所有捕获的对象
     * @info 查看状态
     */
    constructor() {
        this.sources = new Set();
    }

    track(obj: any) {
        if (!obj) return obj;
        if (Array.isArray(obj)) {
            obj.forEach(item => {
                this.track(item);
            })
            return obj;
        }
        if (obj.dispose || obj instanceof THREE.Object3D) {
            this.sources.add(obj);//为后续释放将其从parent中移除
            if (obj instanceof THREE.Object3D) {
                this.track((obj as THREE.Object3D & { geometry: any }).geometry);
                this.track((obj as THREE.Object3D & { material: any }).material);
                this.track((obj as THREE.Object3D & { children: any }).children);
            }
        }
        if (obj instanceof THREE.Material) {
            for (let value of Object.values(obj)) {
                if (value instanceof THREE.Texture) {
                    this.track(value);
                }
            }
        }
        if (obj.uniforms) {
            for (let value of Object.values(obj.uniforms)) {
                if (value) {
                    const { realValue } = (value as any);
                    if (realValue instanceof THREE.Texture) {
                        this.track(value);
                    }
                }
            }
        }

        return obj;
    }
    trackByScene(scene: THREE.Scene) {
        scene.traverse(item => {
            if (item instanceof THREE.Object3D) {
                this.track(item)
            }
        })
    }
    disTrack(obj: any) {
        this.sources.delete(obj);
        if (obj instanceof THREE.Object3D) {
            if (obj.parent) {
                obj.parent.remove(obj);
            }
        }
        obj.dispose && obj.dispose();
        return obj;
    }
    disTrackByGroup(group: THREE.Group) {
        if (group instanceof THREE.Group) {
            const values = [...group.children.values()];
            for (let child of values) {
                if (child instanceof THREE.Mesh || child instanceof THREE.Line || child instanceof THREE.Points) {
                    this.disTrack(child.geometry)
                }
                if ((child as THREE.Mesh).material) {
                    const item: any = child
                    for (let value of Object.values(item.material)) {
                        if (value instanceof THREE.Texture) {
                            this.disTrack(value)
                        }
                    }
                    if (item.material.uniforms) {
                        for (let value of Object.values(item.material.uniforms)) {
                            if (value) {
                                const { realValue } = (value as any);
                                if (realValue instanceof THREE.Texture) {
                                    this.disTrack(realValue)
                                }
                            }
                        }
                    }
                    this.disTrack((child as THREE.Object3D & { material: any }).material)
                }
                if (child instanceof THREE.Group) {
                    this.disTrackByGroup(child)
                }
            }
            for (let child of values) {
                this.sources.has(child) && this.sources.delete(child);
            }
            group.parent && group.parent.remove(group);//?从父节点移除该节点
            this.sources.delete(group);//?从Set中移除该节点
            group.clear();
        }
    }

    allDisTrack() {
        for (let item of this.sources) {
            if (item instanceof THREE.Object3D) {
                if (item.parent) {
                    item.parent.remove(item);
                }
            }
            item.dispose && item.dispose();
        }
        this.sources.clear();
    }
    info() {
        return this.sources
    }
}