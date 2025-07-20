import CreatePostForm from "../components/post/CreatePostForm";
import { useNavigate } from "react-router";
import Header from "../components/Header";

export default function CreatePost() {
  const navigate = useNavigate();

  const handleSuccess = (id) => {
    if (id) {
      navigate(`/post/${id}`);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center py-12">
        <CreatePostForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
} 