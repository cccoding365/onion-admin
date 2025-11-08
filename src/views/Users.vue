<script setup>
import { ref, reactive, computed } from "vue";
import { useI18n } from "vue-i18n";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "../stores/user";
import { useRolesStore } from "../stores/roles";
import dayjs from "dayjs";
import { Male, Female, UserFilled } from "@element-plus/icons-vue";

const { t } = useI18n({ useScope: "global" });
const user = useUserStore();
const rolesStore = useRolesStore();

const editing = ref(null); // username of the row being edited
const editForm = reactive({
  username: "",
  nickname: "",
  role: "user",
  age: 18,
  gender: "other",
});

// 角色选项（仅显示启用的角色），优先显示名称，退回编码
const enabledRoleOptions = computed(() =>
  (rolesStore.roles || [])
    .filter((r) => r.enabled)
    .map((r) => ({ label: r.name || r.code, value: r.code }))
);

// Filters for table
const filters = reactive({ gender: "all", ageMin: 0, ageMax: 120 });
const genderOrder = { male: 1, female: 2, other: 3 };
const filteredUsers = computed(() => {
  const list = user.users || [];
  return list.filter((u) => {
    const genderOk = filters.gender === "all" || u.gender === filters.gender;
    const ageVal = typeof u.age === "number" ? u.age : 0;
    const ageOk = ageVal >= filters.ageMin && ageVal <= filters.ageMax;
    return genderOk && ageOk;
  });
});

function startEdit(row) {
  editing.value = row.username;
  editForm.username = row.username;
  editForm.nickname = row.nickname;
  editForm.role = row.role;
  editForm.age = row.age;
  editForm.gender = row.gender;
}

function cancelEdit() {
  editing.value = null;
}

function saveEdit() {
  try {
    if (editForm.age < 0 || editForm.age > 120) {
      ElMessage.error(t("common.invalidAgeRange"));
      return;
    }
    user.adminUpdateUser({
      username: editForm.username,
      nickname: editForm.nickname,
      role: editForm.role,
      age: editForm.age,
      gender: editForm.gender,
    });
    ElMessage.success(t("usersPage.saved"));
    editing.value = null;
  } catch (e) {
    ElMessage.error(e?.message || String(e));
  }
}

function remove(row) {
  ElMessageBox.confirm(
    t("usersPage.deleteConfirm", { username: row.username }),
    t("usersPage.deleteTitle"),
    {
      type: "warning",
    }
  )
    .then(() => {
      user.adminDeleteUser(row.username);
      ElMessage.success(t("usersPage.deleted"));
    })
    .catch(() => {});
}

// Create dialog
const showCreate = ref(false);
const createForm = reactive({
  username: "",
  password: "",
  nickname: "",
  role: "user",
  age: 18,
  gender: "other",
});

function openCreate() {
  showCreate.value = true;
  createForm.username = "";
  createForm.password = "";
  createForm.nickname = "";
  createForm.role = "user";
}

function submitCreate() {
  try {
    if (!createForm.username || !createForm.password) {
      throw new Error(t("usersPage.required"));
    }
    if (createForm.age < 0 || createForm.age > 120) {
      throw new Error(t("common.invalidAgeRange"));
    }
    user.adminCreateUser({
      username: createForm.username,
      password: createForm.password,
      role: createForm.role,
      nickname: createForm.nickname || createForm.username,
      age: createForm.age,
      gender: createForm.gender,
    });
    showCreate.value = false;
    ElMessage.success(t("usersPage.created"));
  } catch (e) {
    ElMessage.error(e?.message || String(e));
  }
}
</script>

<template>
  <div class="users-page">
    <el-card>
      <template #header>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 12px;
          "
        >
          <span>{{ t("menu.users") }}</span>
          <el-button type="primary" @click="openCreate">{{
            t("usersPage.createUser")
          }}</el-button>
        </div>
      </template>

      <!-- Filters toolbar -->
      <div
        style="
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          align-items: center;
          margin-bottom: 12px;
        "
      >
        <el-select v-model="filters.gender" style="width: 150px">
          <el-option :label="t('common.all')" value="all" />
          <el-option value="male">
            <div style="display: flex; align-items: center; gap: 6px">
              <el-icon><Male /></el-icon>{{ t("common.genderMale") }}
            </div>
          </el-option>
          <el-option value="female">
            <div style="display: flex; align-items: center; gap: 6px">
              <el-icon><Female /></el-icon>{{ t("common.genderFemale") }}
            </div>
          </el-option>
          <el-option value="other">
            <div style="display: flex; align-items: center; gap: 6px">
              <el-icon><UserFilled /></el-icon>{{ t("common.genderOther") }}
            </div>
          </el-option>
        </el-select>
        <el-input-number
          v-model="filters.ageMin"
          :min="0"
          :max="120"
          :step="1"
          controls-position="right"
          :placeholder="t('usersPage.ageMin')"
        />
        <span>-</span>
        <el-input-number
          v-model="filters.ageMax"
          :min="0"
          :max="120"
          :step="1"
          controls-position="right"
          :placeholder="t('usersPage.ageMax')"
        />
        <el-button
          @click="
            filters.gender = 'all';
            filters.ageMin = 0;
            filters.ageMax = 120;
          "
          >{{ t("common.reset") }}</el-button
        >
      </div>

  <el-table :data="filteredUsers" border style="width: 100%">
        <el-table-column type="index" :index="(n) => n + 1" />
        <el-table-column
          :label="t('usersPage.username')"
          prop="username"
          width="150"
        />
        <el-table-column :label="t('usersPage.nickname')" width="220">
          <template #default="{ row }">
            <div v-if="editing === row.username">
              <el-input v-model="editForm.nickname" size="small" />
            </div>
            <div v-else>{{ row.nickname }}</div>
          </template>
        </el-table-column>
        <el-table-column :label="t('usersPage.role')" width="200">
          <template #default="{ row }">
            <div
              v-if="editing === row.username"
              style="display: flex; align-items: center; gap: 8px"
            >
              <el-select
                v-model="editForm.role"
                size="small"
                style="width: 160px"
                :placeholder="t('usersPage.role')"
              >
                <el-option
                  v-for="opt in enabledRoleOptions"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </el-select>
            </div>
            <div v-else>
              <el-tag type="success" v-if="row.role === 'admin'">{{
                t("auth.admin")
              }}</el-tag>
              <el-tag v-else-if="row.role === 'user'">{{ t("auth.user") }}</el-tag>
              <el-tag v-else>
                {{
                  (rolesStore.roles.find((r) => r.code === row.role)?.name) ||
                    row.role
                }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('usersPage.age')"
          width="150"
          :sortable="true"
          :sort-method="(a, b) => (a.age || 0) - (b.age || 0)"
        >
          <template #default="{ row }">
            <div v-if="editing === row.username">
              <el-input-number
                v-model="editForm.age"
                :min="0"
                :max="120"
                size="small"
              />
            </div>
            <div v-else>{{ row.age }}</div>
          </template>
        </el-table-column>
        <el-table-column
          :label="t('usersPage.gender')"
          width="150"
          :sortable="true"
          :sort-method="(a, b) => genderOrder[a.gender] - genderOrder[b.gender]"
        >
          <template #default="{ row }">
            <div v-if="editing === row.username">
              <el-select
                v-model="editForm.gender"
                size="small"
                style="width: 120px"
              >
                <el-option value="male">
                  <div style="display: flex; align-items: center; gap: 6px">
                    <el-icon><Male /></el-icon>{{ t("common.genderMale") }}
                  </div>
                </el-option>
                <el-option value="female">
                  <div style="display: flex; align-items: center; gap: 6px">
                    <el-icon><Female /></el-icon>{{ t("common.genderFemale") }}
                  </div>
                </el-option>
                <el-option value="other">
                  <div style="display: flex; align-items: center; gap: 6px">
                    <el-icon><UserFilled /></el-icon
                    >{{ t("common.genderOther") }}
                  </div>
                </el-option>
              </el-select>
            </div>
            <div v-else>
              <el-tag v-if="row.gender === 'male'">
                <el-icon style="margin-right: 4px"><Male /></el-icon
                >{{ t("common.genderMale") }}
              </el-tag>
              <el-tag type="warning" v-else-if="row.gender === 'female'">
                <el-icon style="margin-right: 4px"><Female /></el-icon
                >{{ t("common.genderFemale") }}
              </el-tag>
              <el-tag type="info" v-else>
                <el-icon style="margin-right: 4px"><UserFilled /></el-icon
                >{{ t("common.genderOther") }}
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="t('usersPage.createdAt')" width="200">
          <template #default="{ row }">
            {{ dayjs(row.createdAt).format("YYYY-MM-DD HH:mm") }}
          </template>
        </el-table-column>
        <el-table-column
          :label="t('usersPage.actions')"
          fixed="right"
          min-width="150"
        >
          <template #default="{ row }">
            <div
              v-if="editing === row.username"
              style="display: flex; gap: 8px"
            >
              <el-button type="primary" size="small" @click="saveEdit">{{
                t("usersPage.save")
              }}</el-button>
              <el-button size="small" @click="cancelEdit">{{
                t("usersPage.cancel")
              }}</el-button>
            </div>
            <div v-else style="display: flex; gap: 8px">
              <el-button type="primary" size="small" @click="startEdit(row)">{{
                t("usersPage.edit")
              }}</el-button>
              <el-button
                v-if="row.role !== 'admin'"
                type="danger"
                size="small"
                @click="remove(row)"
              >{{ t("usersPage.delete") }}</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="showCreate"
      :title="t('usersPage.createUser')"
      width="480px"
    >
      <el-form label-position="top">
        <el-form-item :label="t('usersPage.username')">
          <el-input v-model="createForm.username" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('auth.password')">
          <el-input
            v-model="createForm.password"
            type="password"
            autocomplete="new-password"
          />
        </el-form-item>
        <el-form-item :label="t('usersPage.nickname')">
          <el-input v-model="createForm.nickname" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="t('usersPage.age')">
          <el-input-number
            v-model="createForm.age"
            :min="0"
            :max="120"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="t('usersPage.gender')">
          <el-select v-model="createForm.gender" style="width: 100%">
            <el-option value="male">
              <div style="display: flex; align-items: center; gap: 6px">
                <el-icon><Male /></el-icon>{{ t("common.genderMale") }}
              </div>
            </el-option>
            <el-option value="female">
              <div style="display: flex; align-items: center; gap: 6px">
                <el-icon><Female /></el-icon>{{ t("common.genderFemale") }}
              </div>
            </el-option>
            <el-option value="other">
              <div style="display: flex; align-items: center; gap: 6px">
                <el-icon><UserFilled /></el-icon>{{ t("common.genderOther") }}
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="t('usersPage.role')">
          <el-select v-model="createForm.role" style="width: 100%" :placeholder="t('usersPage.role')">
            <el-option
              v-for="opt in enabledRoleOptions"
              :key="opt.value"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showCreate = false">{{
          t("usersPage.cancel")
        }}</el-button>
        <el-button type="primary" @click="submitCreate">{{
          t("usersPage.create")
        }}</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.users-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
