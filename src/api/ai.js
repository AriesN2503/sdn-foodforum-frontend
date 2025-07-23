import axios from "./axiosClient";

const aiApi = {
    // Hàm gửi câu hỏi đến AI backend
    sendQuestion: async (question, context = {}) => {
        try {
            const response = await axios.post("/ai/chat", {
                question,
                context
            });
            return response.data;
        } catch (error) {
            console.error("Error sending question to AI:", error);
            throw error;
        }
    }
};

export default aiApi;
