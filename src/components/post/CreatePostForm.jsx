import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { createPost } from "../../api/post";
import { uploadImageToCloudinary } from "../../api/cloudinary";
import { useToast } from "../../context/ToastContext";

export default function CreatePostForm({ onSuccess }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]); // array of url
  const [imageFiles, setImageFiles] = useState([]); // array of File
  const [imagePreviews, setImagePreviews] = useState([]); // preview local
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState("");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  // Hiển thị preview ảnh trước khi upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    setImages([]); // reset link cloudinary
    setImagePreviews(files.map(file => URL.createObjectURL(file)));
  };

  // Thêm tag (loại bỏ khoảng trắng, trùng lặp)
  const handleAddTag = () => {
    const clean = tagInput.trim();
    if (clean && !tags.map(t => t.toLowerCase()).includes(clean.toLowerCase())) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  };
  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  // Thêm nguyên liệu (loại bỏ khoảng trắng, trùng lặp)
  const handleAddIngredient = () => {
    const clean = ingredientInput.trim();
    if (clean && !ingredients.map(i => i.toLowerCase()).includes(clean.toLowerCase())) {
      setIngredients([...ingredients, clean]);
    }
    setIngredientInput("");
  };
  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter((i) => i !== ing));
  };

  // Validate nâng cao
  const validate = () => {
    if (!title.trim()) return "Vui lòng nhập tiêu đề.";
    if (!content.trim()) return "Vui lòng nhập mô tả.";
    if (ingredients.length === 0) return "Vui lòng nhập ít nhất 1 nguyên liệu.";
    if (!instructions.trim()) return "Vui lòng nhập hướng dẫn.";
    // Kiểm tra lỗi upload ảnh (nếu có)
    for (const file of imageFiles) {
      if (!file.type.startsWith("image/")) return "Chỉ cho phép file ảnh.";
    }
    return null;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errMsg = validate();
    if (errMsg) {
      setError(errMsg);
      return;
    }
    setLoading(true);
    try {
      let uploadedImages = [];
      if (imageFiles.length > 0) {
        for (const file of imageFiles) {
          const url = await uploadImageToCloudinary(file);
          uploadedImages.push(url);
        }
      }
      const data = {
        title: title.trim(),
        content: content.trim(),
        image: uploadedImages,
        tags,
        ingredients,
        instructions: instructions.trim(),
      };
      const res = await createPost(data);
      showToast("Tạo bài viết thành công!", { type: "success" });
      if (onSuccess && res && (res.data?._id || res.data?.id)) {
        onSuccess(res.data._id || res.data.id);
      }
      // Reset form
      setTitle(""); setContent(""); setImages([]); setImageFiles([]); setImagePreviews([]); setTags([]); setTagInput(""); setIngredients([]); setIngredientInput(""); setInstructions("");
    } catch (err) {
      setError("Không thể tạo bài viết. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="w-full max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl space-y-7 border border-gray-100"
      onSubmit={handleSubmit}
      style={{ minWidth: 320 }}
    >
      <h2 className="text-3xl font-extrabold text-orange-600 mb-6 text-center tracking-tight">Tạo bài viết mới</h2>
      {error && <div className="text-red-600 bg-red-50 border border-red-200 p-2 rounded text-center">{error}</div>}
      <div>
        <label className="block font-semibold mb-2 text-base">Tiêu đề <span className="text-red-500">*</span></label>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Nhập tiêu đề bài viết" required className="text-base px-4 py-2" />
      </div>
      <div>
        <label className="block font-semibold mb-2 text-base">Mô tả <span className="text-red-500">*</span></label>
        <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Nhập mô tả ngắn về món ăn" required rows={3} className="text-base px-4 py-2" />
      </div>
      <div>
        <label className="block font-semibold mb-2 text-base">Ảnh món ăn (có thể chọn nhiều)</label>
        <Input type="file" multiple accept="image/*" onChange={handleImageChange} className="text-base" />
        <div className="flex flex-wrap gap-3 mt-3">
          {imagePreviews.map((url, idx) => (
            <img key={idx} src={url} alt="Ảnh xem trước" className="w-28 h-28 object-cover rounded-lg border border-orange-200 shadow" />
          ))}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2 text-base">Tag/phân loại</label>
        <div className="flex gap-2 mb-2">
          <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Nhập tag và nhấn Thêm" onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddTag()) : null} className="text-base" />
          <Button type="button" onClick={handleAddTag} variant="outline" className="font-semibold">Thêm</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span key={idx} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
              {tag}
              <button type="button" className="ml-1 text-orange-500 hover:text-red-500" onClick={() => handleRemoveTag(tag)}>&times;</button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2 text-base">Nguyên liệu <span className="text-red-500">*</span></label>
        <div className="flex gap-2 mb-2">
          <Input value={ingredientInput} onChange={e => setIngredientInput(e.target.value)} placeholder="Nhập nguyên liệu và nhấn Thêm" onKeyDown={e => e.key === 'Enter' ? (e.preventDefault(), handleAddIngredient()) : null} className="text-base" />
          <Button type="button" onClick={handleAddIngredient} variant="outline" className="font-semibold">Thêm</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ing, idx) => (
            <span key={idx} className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm flex items-center gap-1 font-medium">
              {ing}
              <button type="button" className="ml-1 text-orange-500 hover:text-red-500" onClick={() => handleRemoveIngredient(ing)}>&times;</button>
            </span>
          ))}
        </div>
      </div>
      <div>
        <label className="block font-semibold mb-2 text-base">Hướng dẫn <span className="text-red-500">*</span></label>
        <Textarea value={instructions} onChange={e => setInstructions(e.target.value)} placeholder="Nhập hướng dẫn/cách làm món ăn" required rows={5} className="text-base px-4 py-2" />
      </div>
      <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-3 rounded-xl shadow" disabled={loading}>
        {loading ? "Đang tạo..." : "Tạo bài viết"}
      </Button>
    </form>
  );
} 