"use client";

import { useState } from "react";

export default function Home() {
	const [formData, setFormData] = useState({
		titulo: "",
		data: "",
		horaInicio: "",
		horaFim: "",
		linkMeet: "",
		descricao: "",
	});

	const [generatedLink, setGeneratedLink] = useState("");

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const ensureProtocol = (url: string) => {
		if (!url) return "";
		const trimmedUrl = url.trim();
		// Verifica se começa com http:// ou https:// (case insensitive)
		if (!/^https?:\/\//i.test(trimmedUrl)) {
			return `https://${trimmedUrl}`;
		}
		return trimmedUrl;
	};

	const formatGoogleDate = (dateStr: string, timeStr: string) => {
		if (!dateStr || !timeStr) return "";
		const dateClean = dateStr.replace(/-/g, "");
		const timeClean = timeStr.replace(/:/g, "") + "00";
		return `${dateClean}T${timeClean}`;
	};

	const generateLink = (e: React.FormEvent) => {
		e.preventDefault();

		const { titulo, data, horaInicio, horaFim, linkMeet, descricao } = formData;

		const startDateTime = formatGoogleDate(data, horaInicio);
		const endDateTime = formatGoogleDate(data, horaFim);

		// Aplica a sanitização no link do meet aqui
		const locationUrl = ensureProtocol(linkMeet);

		const params = new URLSearchParams();
		params.append("action", "TEMPLATE");
		params.append("text", titulo);
		params.append("details", descricao);
		params.append("location", locationUrl);

		if (startDateTime && endDateTime) {
			params.append("dates", `${startDateTime}/${endDateTime}`);
		}

		const finalUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;
		setGeneratedLink(finalUrl);
	};

	const copyUrlToClipboard = () => {
		navigator.clipboard.writeText(generatedLink);
		alert("URL bruta copiada!");
	};

	const copyRichLinkToClipboard = () => {
		const linkHtml = `<a href="${generatedLink}">${
			formData.titulo || "Link do Evento"
		}</a>`;

		const blobHtml = new Blob([linkHtml], { type: "text/html" });
		const blobText = new Blob([generatedLink], { type: "text/plain" });

		const data = [
			new ClipboardItem({
				["text/html"]: blobHtml,
				["text/plain"]: blobText,
			}),
		];

		navigator.clipboard
			.write(data)
			.then(() => {
				alert("Hiperlink copiado! Tente colar em um e-mail.");
			})
			.catch((err) => {
				console.error("Erro ao copiar: ", err);
				alert("Erro ao copiar rich text. Seu navegador pode não suportar.");
			});
	};

	return (
		<div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
				<h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
					Gerador de Link Calendar
				</h1>

				<form onSubmit={generateLink} className="space-y-4">
					{/* Título */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Nome do Evento
						</label>
						<input
							type="text"
							name="titulo"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black focus:ring-blue-500 focus:border-blue-500"
							value={formData.titulo}
							onChange={handleChange}
						/>
					</div>

					{/* Data */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Data
						</label>
						<input
							type="date"
							name="data"
							required
							className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
							value={formData.data}
							onChange={handleChange}
						/>
					</div>

					{/* Horários */}
					<div className="grid grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Início
							</label>
							<input
								type="time"
								name="horaInicio"
								required
								className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
								value={formData.horaInicio}
								onChange={handleChange}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Fim
							</label>
							<input
								type="time"
								name="horaFim"
								required
								className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
								value={formData.horaFim}
								onChange={handleChange}
							/>
						</div>
					</div>

					{/* Link Meet */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Link do Meet / Local
						</label>
						<input
							type="text"
							name="linkMeet"
							placeholder="ex: meet.google.com/abc-defg-hij"
							className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
							value={formData.linkMeet}
							onChange={handleChange}
						/>
						<p className="text-xs text-gray-500 mt-1">
							Aceita com ou sem https://
						</p>
					</div>

					{/* Descrição */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Descrição
						</label>
						<textarea
							name="descricao"
							rows={3}
							className="mt-1 block w-full rounded-md border border-gray-300 p-2 text-black"
							value={formData.descricao}
							onChange={handleChange}
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
					>
						Gerar Link
					</button>
				</form>

				{/* Área de Resultado */}
				{generatedLink && (
					<div className="mt-8 pt-6 border-t border-gray-200">
						{/* Resultado 1: Hiperlink Formatado */}
						<div className="mb-6">
							<h3 className="text-sm font-bold text-gray-700 mb-2">
								Preview do Hiperlink:
							</h3>
							<div className="p-4 bg-blue-50 border border-blue-100 rounded flex flex-col items-center gap-3">
								{/* O Link Renderizado */}
								<a
									href={generatedLink}
									target="_blank"
									rel="noreferrer"
									className="text-xl font-bold text-blue-600 hover:underline cursor-pointer"
								>
									{formData.titulo || "Link do Evento"}
								</a>

								{/* Botão de Copiar Rich Text */}
								<button
									onClick={copyRichLinkToClipboard}
									className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 shadow-sm flex items-center gap-2"
								>
									📋 Copiar Hiperlink
								</button>
							</div>
						</div>

						{/* Resultado 2: URL Crua */}
						<div>
							<h3 className="text-sm font-bold text-gray-700 mb-2">
								URL Completa:
							</h3>
							<div className="flex gap-2">
								<input
									readOnly
									value={generatedLink}
									className="flex-1 text-xs bg-gray-100 border border-gray-300 p-2 rounded text-gray-600 font-mono"
								/>
								<button
									onClick={copyUrlToClipboard}
									className="bg-gray-700 text-white px-3 py-2 rounded hover:bg-gray-800 text-xs font-medium whitespace-nowrap"
								>
									Copiar URL
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
