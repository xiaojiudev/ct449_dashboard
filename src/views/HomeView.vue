<template>
    <a-breadcrumb style="margin: 16px 0">
        <a-breadcrumb-item>Home</a-breadcrumb-item>
    </a-breadcrumb>
    <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
        <a-row :gutter="[16, 16]">
            <a-col :span="12">
                <div style="background: #ececec; padding: 30px; width: 500px;">
                    <a-row :gutter="16">
                        <a-col :span="12">
                            <a-card>
                                <a-statistic title="Feedback" :value="11.28" :precision="2" suffix="%"
                                    :value-style="{ color: '#3f8600' }" style="margin-right: 50px">
                                    <template #prefix>
                                        <arrow-up-outlined />
                                    </template>
                                </a-statistic>
                            </a-card>
                        </a-col>
                        <a-col :span="12">
                            <a-card>
                                <a-statistic title="Idle" :value="9.3" :precision="2" suffix="%" class="demo-class"
                                    :value-style="{ color: '#cf1322' }">
                                    <template #prefix>
                                        <arrow-down-outlined />
                                    </template>
                                </a-statistic>
                            </a-card>
                        </a-col>
                    </a-row>
                </div>
            </a-col>
            <a-col :span="12">
                <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
                    <a-progress type="circle" :stroke-color="{
                        '0%': '#108ee9',
                        '100%': '#87d068',
                    }" :percent="90" />
                </div>
            </a-col>
            <a-col :span="4">
                <a-statistic title="Total Orders" :value="112893" style="margin-right: 50px" />
            </a-col>
            <a-col :span="4">
                <a-statistic title="Total Profit ($)" :precision="2" :value="112893" />
            </a-col>
            <a-col :span="4">
                <a-statistic title="Feedback" :value="1128" style="margin-right: 50px">
                    <template #suffix>
                        <like-outlined />
                    </template>
                </a-statistic>
            </a-col>
            <a-col :span="4">
                <a-statistic title="Unmerged" :value="93" class="demo-class">
                    <template #suffix>
                        <span>/ 100</span>
                    </template>
                </a-statistic>
            </a-col>
        </a-row>
        <a-row>

        </a-row>
    </div>
</template>

<script lang="ts" setup>
import { ArrowUpOutlined, ArrowDownOutlined, LikeOutlined  } from '@ant-design/icons-vue';
</script>
