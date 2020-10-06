export default function (doctors) {
	const helperArr = doctors.map((doc) => {
		const doctorH = {
			cuit: doc.cuit,
			ws: doc.ws,
			fullname: doc.fullname,
			status: doc.enable,
		};
		const days = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

		const sheet = doc.sheet_online || doc.sheet_consultorio_online;

		Object.keys(sheet).map((key, index) => {
			const hf1 = sheet?.[key]?.[0];
			const ht1 = sheet?.[key]?.[1];
			const hf2 = sheet?.[key]?.[6];
			const ht2 = sheet?.[key]?.[7];
			const hours = {
				hourFrom1: hf1 ? hf1 : '',
				hourTo1: ht1 ? ht1 : '',
				hourFrom2: hf2 ? hf2 : '',
				hourTo2: ht2 ? ht2 : '',
			};
			doctorH[days[index]] = `${hours.hourFrom1} - ${hours.hourTo1}  ${hours.hourFrom2} - ${hours.hourTo2}`;
		});

		return doctorH;
	});
	return helperArr;
}
