<template>
  <div class="category-manager">
    <div class="manager-header">
      <h2>🗂️ 分类管理</h2>
      <button @click="openAddModal" class="add-btn">
        ➕ 添加分类
      </button>
    </div>

    <div class="categories-grid">
      <draggable
        v-model="localCategories"
        v-bind="dragOptions"
        item-key="id"
        class="draggable-grid"
      >
        <template #item="{ element: category }">
          <div class="category-card">
            <!-- 拖拽手柄现在是这个 header -->
            <div class="category-card-header">
              <div class="category-info">
                <span class="category-icon">{{ category.icon }}</span>
                <h3>{{ category.name }}</h3>
              </div>
              <div class="category-actions">
                <button @click="editCategory(category)" class="edit-btn" title="编辑分类">✏️</button>
                <button @click="deleteCategory(category)" class="delete-btn" title="删除分类">🗑️</button>
              </div>
            </div>
            <div class="category-card-body">
              <div class="site-count">
                共 {{ category.sites ? category.sites.length : 0 }} 个脚本
              </div>
              <ul class="site-list scrollable-list">
                <!-- 修改点 2: 添加 @click 事件 -->
                <li
                  v-for="site in (category.sites || [])"
                  :key="site.id"
                  class="site-list-item clickable"
                  @click="handleScriptClick(site, category)"
                >
                  <span>{{ site.name }}</span>
                </li>
                <li v-if="!category.sites || category.sites.length === 0" class="site-list-item no-items">
                  暂无脚本
                </li>
              </ul>
            </div>
          </div>
        </template>
      </draggable>
    </div>

    <!-- 添加/编辑分类弹窗 -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ editingCategory ? '编辑分类' : '添加分类' }}</h3>
          <button @click="closeModal" class="close-btn">✕</button>
        </div>
        <form @submit.prevent="saveCategory" class="category-form">
          <div class="form-group">
            <label for="category-name">分类名称 *</label>
            <input id="category-name" v-model="formData.name" required placeholder="例如：Git 指令" />
          </div>
          <!-- 修改点 2: 实现图标选择器 -->
          <div class="form-group">
            <label>分类图标 (Emoji)</label>
            <div class="icon-picker">
              <div class="selected-icon-preview">
                当前选择: <span>{{ formData.icon || '无' }}</span>
              </div>
              <div class="icon-grid">
                <span
                  v-for="emoji in emojiPresets"
                  :key="emoji"
                  class="emoji-option"
                  :class="{ selected: formData.icon === emoji }"
                  @click="formData.icon = emoji"
                >
                  {{ emoji }}
                </span>
              </div>
            </div>
          </div>
          <div class="form-actions">
            <button type="button" @click="closeModal" class="cancel-btn">取消</button>
            <button type="submit" class="submit-btn">{{ editingCategory ? '更新' : '添加' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import draggable from 'vuedraggable'

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
})

// 修改点 2.1: 增加 'script-clicked' 事件
const emit = defineEmits(['update', 'script-clicked'])

const localCategories = ref([])
const showModal = ref(false)
const editingCategory = ref(null)
const formData = ref({ name: '', icon: '' })

// 修改点 2.1: 定义预设的 Emoji 图标
const emojiPresets = ref([
  '🐙', '🐳', '🐧', '💻', '🔧', '⚙️', '💡', '📚', '📦', '🚀',
  '🔗', '💾', '📈', '📊', '☁️', '🎨', '🔑', '🔒', '🌐', '🤖',
  '🍎', '💵', '⚡️', '🔥', '⭐️', '❤️', '✅', '❓', '⚠️'
])

watch(() => props.categories, (newVal) => {
  localCategories.value = JSON.parse(JSON.stringify(newVal))
}, { immediate: true, deep: true })

const syncToParent = () => {
  emit('update', localCategories.value)
}

// 修改点 1: 在拖拽选项中添加 handle
const dragOptions = computed(() => ({
  animation: 200,
  group: "categories",
  ghostClass: "sortable-ghost",
  handle: ".category-card-header", // 指定只有这个 class 的元素可以拖拽
}))

const openAddModal = () => {
  editingCategory.value = null
  formData.value = { name: '', icon: '💡' } // 默认选中一个图标
  showModal.value = true
}

const editCategory = (category) => {
  editingCategory.value = category
  formData.value = { ...category }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const saveCategory = () => {
  if (editingCategory.value) {
    const index = localCategories.value.findIndex(c => c.id === editingCategory.value.id)
    if (index !== -1) {
      localCategories.value[index] = { ...localCategories.value[index], ...formData.value }
    }
  } else {
    localCategories.value.push({
      id: `cat-${Date.now()}`,
      name: formData.value.name,
      icon: formData.value.icon,
      sites: []
    })
  }
  syncToParent()
  closeModal()
}

const deleteCategory = (category) => {
  if (confirm(`确定要删除分类 "${category.name}" 吗？\n注意：分类下的所有脚本也会被一并删除！`)) {
    localCategories.value = localCategories.value.filter(c => c.id !== category.id)
    syncToParent()
  }
}

const handleScriptClick = (site, category) => {
  emit('script-clicked', { siteId: site.id, categoryId: category.id })
}
</script>

<style scoped>
.category-manager {
  padding: 20px 0;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 2px solid #e9ecef;
}

.manager-header h2 {
  color: #2c3e50;
  margin: 0;
  font-size: 24px;
}

.add-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #27ae60;
  color: white;
}

.add-btn:hover {
  background: #219a52;
}

.draggable-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.category-card {
  /* 移除这里的 cursor: move */
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: box-shadow 0.3s ease;
}

.category-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* ... (sortable-ghost 样式) ... */

.category-card-header {
  /* 修改点 1.1: 将拖拽手势光标应用到这里 */
  cursor: move;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: white;
  border-bottom: 1px solid #e9ecef;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.category-icon {
  font-size: 24px;
}

.category-info h3 {
  margin: 0;
  font-size: 18px;
  color: #2c3e50;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.edit-btn:hover { background-color: #f1c40f30; }
.delete-btn:hover { background-color: #e74c3c30; }

.category-card-body {
  padding: 15px;
  flex-grow: 1;
  /* 新增：为了让滚动条正常工作 */
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.site-count {
  font-size: 13px;
  color: #7f8c8d;
  margin-bottom: 10px;
  font-weight: 500;
  flex-shrink: 0; /* 防止被压缩 */
}

.site-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* 修改点 1.1: 为脚本列表添加滚动条样式 */
.scrollable-list {
  flex-grow: 1;
  overflow-y: auto;
  max-height: 180px; /* 设定一个最大高度 */
  padding-right: 5px; /* 为滚动条留出空间 */
}

/* 美化滚动条 (可选) */
.scrollable-list::-webkit-scrollbar {
  width: 6px;
}
.scrollable-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}
.scrollable-list::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 3px;
}
.scrollable-list::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}


.site-list-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  font-size: 14px;
  color: #34495e;
  border-bottom: 1px solid #ecf0f1;
}

/* 修改点 2.3: 为可点击的脚本项添加样式 */
.site-list-item.clickable {
  cursor: pointer;
  transition: background-color 0.2s;
}

.site-list-item.clickable:hover {
  background-color: #e8f4fd; /* 悬停时显示淡蓝色背景 */
}

.site-list-item:last-child {
  border-bottom: none;
}

.site-list-item.no-items {
  color: #95a5a6;
  font-style: italic;
}

/* 弹窗样式 (与 SiteManager 类似) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.modal-header h3 { margin: 0; }
.close-btn { background: none; border: none; font-size: 20px; cursor: pointer; }

.category-form { padding: 20px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 500; }
.form-group input { width: 100%; padding: 10px; border: 2px solid #e1e1e1; border-radius: 4px; }
.form-group input:focus { outline: none; border-color: #3498db; }

/* 修改点 2.2: 图标选择器相关样式 */
.icon-picker {
  border: 2px solid #e1e1e1;
  border-radius: 4px;
  padding: 10px;
}

.selected-icon-preview {
  margin-bottom: 10px;
  font-size: 14px;
  color: #555;
}

.selected-icon-preview span {
  font-size: 20px;
  font-weight: bold;
  color: #3498db;
  margin-left: 5px;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30px, 1fr));
  gap: 8px;
}

.emoji-option {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  padding: 5px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.emoji-option:hover {
  background-color: #ecf0f1;
  transform: scale(1.2);
}

.emoji-option.selected {
  background-color: #3498db;
  color: white;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #3498db;
}


.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.cancel-btn, .submit-btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: 1px solid transparent; /* 添加边框以统一高度 */
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background-color: #e9ecef;
  color: #495057;
  border-color: #dee2e6;
}

.cancel-btn:hover {
  background-color: #dee2e6;
}

.submit-btn {
  background-color: #3498db; /* 主色调，例如蓝色 */
  color: white;
}

.submit-btn:hover {
  background-color: #2980b9; /* 主色调的深色变体 */
}
</style>
