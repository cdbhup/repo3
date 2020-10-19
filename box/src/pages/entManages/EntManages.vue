<template>
  <div class="ent">
    <div class="formData">
      <el-card class="searchModule">
        <el-form :model="ent" label-width="100px" :inline="true" :ref="ent">
          <el-form-item label="客户名称" prop="nickName">
            <el-input v-model="ent.nickName" clearable></el-input>
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select v-model="ent.status" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="空箱下单时间" prop="time">
            <el-date-picker
              v-model="ent.time"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="重箱下单时间" prop="time1">
            <el-date-picker
              v-model="ent.time1"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']"
            ></el-date-picker>
          </el-form-item>

          <el-button type="primary" @click="search()">查询</el-button>
          <el-button type="primary" @click="resetForm(ent)">重置</el-button>
        </el-form>
      </el-card>
    </div>
    <div class="table">
      <el-card>
        <div class="btn">
          <!-- <el-button type="primary" @click="addData">新增</el-button>-->
          <el-button type="primary" @click="entdetial">详情</el-button>
          <!-- <el-button type="primary" @click="isOpen">启用</el-button>
          <el-button type="primary" @click="isClose">禁用</el-button>-->
          <el-button type="primary" @click="delData">删除</el-button>
        </div>

        <div class="tabledata">
          <sirui-table
            class="operateTaable"
            :page="page"
            :loading="load"
            :data="tableData"
            @handleSelectionChange="handleSelectionChange"
            @handleSizeChange="handleSizeChange"
            @handleCurrentChange="handleCurrentChange"
            :tableHeight="tableHeight"
          >
            <el-table-column align="center" type="selection" width="45"></el-table-column>

            <el-table-column prop="orderName" label="订单名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="orderCode" label="订单编号" show-overflow-tooltip></el-table-column>
            <el-table-column prop="remake" label="订单状态" show-overflow-tooltip></el-table-column>
            <el-table-column prop="createBy" label="客户名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="boxId" label="箱子id" show-overflow-tooltip></el-table-column>
            <el-table-column prop="boxCode" label="箱子编号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="boxStandard" label="箱子规格" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="leaseDuration" label="凭租时长" show-overflow-tooltip></el-table-column>

            <el-table-column prop="totalPrice" label="实付积分" show-overflow-tooltip></el-table-column>
            <el-table-column prop="emptyBoxOrderTime" label="空箱下单时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="heavyBoxOrderTime" label="重箱下单时间" show-overflow-tooltip></el-table-column>
            <el-table-column prop="terminal" label="操作" fixed="right" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  v-if="scope.row.terminal==='发送空箱'"
                  @click="cz(scope.row)"
                  style="color:orange;"
                >发送空箱</el-button>
                <el-button
                  size="mini"
                  @click="cz(scope.row)"
                  v-else-if="scope.row.terminal==='收取重箱'"
                  style="color:green"
                >收取重箱</el-button>
                <el-button
                  size="mini"
                  @click="cz(scope.row)"
                  v-else-if="scope.row.terminal==='发送重箱'"
                  style="color:blue"
                >发送重箱</el-button>
                <el-button
                  size="mini"
                  @click="cz(scope.row)"
                  v-else-if="scope.row.terminal==='收取空箱'"
                  style="color:pink"
                >收取空箱</el-button>
                <el-button size="mini" v-else style="display:none">--</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="emptyBoxCallTime"
              label="空箱上门下单时间"
              v-if="isShow"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="heavyBoxCallTime"
              label="重箱提取下单时间"
              v-if="isShow2"
              show-overflow-tooltip
            ></el-table-column>
          </sirui-table>
        </div>
      </el-card>
    </div>
    <EntDetial ref="detaildata"></EntDetial>
  </div>
</template>

<script>
import SiruiTable from "@/components/SiruiTable";
import EntDetial from "@/pages/entManages/EntDetial";
export default {
  name: "entmanages",
  components: {
    SiruiTable,
    EntDetial
  },
  mounted: function() {
    this.getData();
    console.log(this.ent.time);
  },
  methods: {
    //查询
    search() {
      this.getData();
    },
    //操作接口
    cz(row) {
      let operate = 0;

      if (row.status == 1) {
        operate = 2;
      } else if (row.status == 2) {
        operate = 3;
      } else if (row.status == 3) {
        operate = 4;
      } else if (row.status == 4) {
        operate = 5;
      } else if (row.status == 5) {
        operate = 6;
      } else if (row.status == 6) {
        operate = 7;
      } else if (row.status == 7) {
        operate = 8;
      } else if (row.status == 8) {
        operate = 9;
      } else if (row.status == 9) {
        operate = 10;
      }

      let paramForm = {};
      this.$axios
        .put(
          "prod-api/backend/order/operate/" +
            row.id +
            "/" +
            operate +
            "/" +
            row.version,
          paramForm
        )
        .then(res => {
          if (200 == res.data.code) {
            this.getData();
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
          } else {
            this.$message({
              showClose: true,
              message: res.data.msg,
              type: "error"
            });
          }
        });
    },
    //获取列表数据
    getData() {
      if (this.ent.time !== "") {
        let start = this.moment(this.ent.time[0]).format("YYYY-MM-DD HH:mm:ss");
        let end = this.moment(this.ent.time[1]).format("YYYY-MM-DD HH:mm:ss");
        this.ent.emptyBoxOrderTimeStart = start;
        this.ent.emptyBoxOrderTimeEnd = end;
      }
      if (this.ent.time1 !== "") {
        let start1 = this.moment(this.ent.time1[0]).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        let end1 = this.moment(this.ent.time1[1]).format("YYYY-MM-DD HH:mm:ss");
        this.ent.heavyBoxOrderTimeStart = start1;
        this.ent.heavyBoxOrderTimeEnd = end1;
      }
      this.$axios
        .get(
          "prod-api/backend/order/list?" +
            "pageNum=" +
            this.page.pageNum +
            "&pageSize=" +
            this.page.pageSize +
            "&nickName=" +
            this.ent.nickName +
            "&status=" +
            this.ent.status +
            "&emptyBoxOrderTimeStart=" +
            this.ent.emptyBoxOrderTimeStart +
            "&emptyBoxOrderTimeEnd=" +
            this.ent.emptyBoxOrderTimeEnd +
            "&heavyBoxOrderTimeStart=" +
            this.ent.heavyBoxOrderTimeStart +
            "&heavyBoxOrderTimeEnd=" +
            this.ent.heavyBoxOrderTimeEnd
        )

        .then(res => {
          if (200 == res.data.code) {
            this.tableData = res.data.rows;
            this.page.total = res.data.total;
            console.log(this.ent.emptyBoxOrderTimeStart);
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].status == "1") {
                this.tableData[i].terminal = "发送空箱";
              } else if (this.tableData[i].status == "4") {
                this.tableData[i].terminal = "收取重箱";
              } else if (this.tableData[i].status == "6") {
                this.tableData[i].terminal = "发送重箱";
              } else if (this.tableData[i].status == "9") {
                this.tableData[i].terminal = "收取空箱";
              }
            }
            for (var i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].status == "1") {
                this.tableData[i].remake = "待发空箱";
              } else if (this.tableData[i].status == "2") {
                this.tableData[i].remake = "已发空箱";
              } else if (this.tableData[i].status == "3") {
                this.tableData[i].remake = "送达空箱";
              } else if (this.tableData[i].status == "4") {
                this.tableData[i].remake = "待发重箱";
              } else if (this.tableData[i].status == "5") {
                this.tableData[i].remake = "已存储";
              } else if (this.tableData[i].status == "6") {
                this.tableData[i].remake = "待发重箱";
              } else if (this.tableData[i].status == "7") {
                this.tableData[i].remake = "已发重箱";
              } else if (this.tableData[i].status == "8") {
                this.tableData[i].remake = "送达重箱";
              } else if (this.tableData[i].status == "9") {
                this.tableData[i].remake = "待收空箱";
              } else if (this.tableData[i].status == "10") {
                this.tableData[i].remake = "已完成";
              }
            }
          } else {
          }
        });
    },

    //选中触发
    handleSelectionChange(row) {
      this.multipleSelection = row;
      //JSON.stringify(this.multipleSelection);
      //console.log(this.multipleSelection[0].id);
    },
    //每页条数
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getData();
    },

    //详情
    entdetial() {
      if (1 == this.multipleSelection.length) {
        this.$refs.detaildata.openDialog(
          true,
          JSON.parse(JSON.stringify(this.multipleSelection[0]))
        );
      } else {
        this.$message({
          showClose: true,
          message: "请选择一条数据进行查看详情",
          type: "error"
        });
      }
    },
    //重置
    resetForm(formName) {
      if (this.$refs[formName] !== undefined) {
        this.$refs[formName].resetFields();
      }
      this.getData();
    },
    //删除
    delData() {
      if (this.multipleSelection.length >= 1) {
        if (0 != this.multipleSelection.length) {
          this.$confirm("此操作将永久删除改数据", "是否继续？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let param = {
                ids: []
              };
              for (var i = 0; i < this.multipleSelection.length; i++) {
                param.ids.push(this.multipleSelection[i].id);
              }
              param.ids = param.ids.join(",");
              this.$axios
                .delete("prod-api/backend/order/delete/" + param.ids, param)
                .then(res => {
                  if (200 == res.data.code) {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "success"
                    });
                    this.getData();
                  } else {
                    this.$message({
                      showClose: true,
                      message: res.data.msg,
                      type: "error"
                    });
                  }
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消"
              });
            });
        }
      } else {
        this.$message({
          showClose: true,
          message: "请选择数据进行操作",
          type: "error"
        });
      }
    }
  },
  data() {
    return {
      isShow: false,

      tableHeight: 400,
      isShow2: false,
      ent: {
        id: "",
        nickName: "",
        status: "",
        emptyBoxOrderTimeStart: "",
        emptyBoxOrderTimeEnd: "",
        heavyBoxOrderTimeStart: "",
        heavyBoxOrderTimeEnd: "",
        time: "",
        time1: ""
      },

      dialogVisible: false,
      page: {
        pages: 0, //总共多少页
        pageNum: 1, //第几页
        pageSize: 10, //一页多少条数据
        total: 0 // 总共多少条
      },
      load: false,
      multipleSelection: [],
      options: [
        {
          value: "1",
          label: "代发空箱"
        },
        {
          value: "2",
          label: "已发空箱"
        },
        {
          value: "3",
          label: "送达空箱"
        },
        {
          value: "4",
          label: "待收重箱"
        },
        {
          value: "5",
          label: "已存储"
        },
        {
          value: "6",
          label: "待发重箱"
        },
        {
          value: "7",
          label: "已发重箱"
        },
        {
          value: "8",
          label: "送达重箱"
        },
        {
          value: "9",
          label: "待收重箱"
        },
        {
          value: "10",
          label: "已完成"
        }
      ],
      columnList: [],
      tableData: []
    };
  }
};
</script>
<style lang="scss" scoped>
.user {
  position: relative;
}
.btnmm {
  position: absolute;
  right: 675px;
  top: 85px;
}
.btnnn {
  position: absolute;
  right: 575px;
  top: 85px;
}
.table {
  margin-top: 11px;
}
</style>